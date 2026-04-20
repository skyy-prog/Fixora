import jwt from "jsonwebtoken";
import mongoose from "mongoose";
import Accounts from "../Models/AccountNeuralschema.js";
import ChatThread from "../Models/ChatThreadSchema.js";
import ChatMessage from "../Models/ChatMessageSchema.js";

const CHAT_ROLES = new Set(["user", "repairer"]);

const parseCookies = (cookieHeader = "") =>
  cookieHeader
    .split(";")
    .map((item) => item.trim())
    .filter(Boolean)
    .reduce((accumulator, item) => {
      const separatorIndex = item.indexOf("=");
      if (separatorIndex === -1) return accumulator;
      const key = item.slice(0, separatorIndex).trim();
      const value = item.slice(separatorIndex + 1).trim();
      accumulator[key] = decodeURIComponent(value);
      return accumulator;
    }, {});

const toIdString = (value) => String(value || "");

const buildAccessFilter = (threadId, role, accountId) =>
  role === "user"
    ? { _id: threadId, userAccountId: accountId }
    : { _id: threadId, repairerAccountId: accountId };

const emitThreadUpdate = (io, thread) => {
  const threadId = toIdString(thread?._id);
  if (!threadId) return;

  io.to(`account:${toIdString(thread.userAccountId)}`).emit("chat:thread-updated", { threadId });
  io.to(`account:${toIdString(thread.repairerAccountId)}`).emit("chat:thread-updated", { threadId });
};

export const registerChatSocketHandlers = (io) => {
  io.use(async (socket, next) => {
    try {
      const cookies = parseCookies(socket.handshake?.headers?.cookie || "");
      const token = cookies.token;

      if (!token) {
        return next(new Error("Not authenticated"));
      }

      const decodedToken = jwt.verify(token, process.env.JWT_SECRET);
      const account = await Accounts.findById(decodedToken.id).select("role");

      if (!account || !CHAT_ROLES.has(account.role)) {
        return next(new Error("Unauthorized role"));
      }

      socket.accountId = toIdString(decodedToken.id);
      socket.accountRole = account.role;
      return next();
    } catch (error) {
      return next(new Error("Socket authentication failed"));
    }
  });

  io.on("connection", (socket) => {
    socket.join(`account:${socket.accountId}`);

    socket.on("chat:join-thread", async (payload = {}, callback = () => {}) => {
      try {
        const threadId = toIdString(payload?.threadId);
        if (!mongoose.Types.ObjectId.isValid(threadId)) {
          callback({ success: false, msg: "Invalid thread id" });
          return;
        }

        const accessFilter = buildAccessFilter(threadId, socket.accountRole, socket.accountId);
        const thread = await ChatThread.findOne(accessFilter).lean();

        if (!thread) {
          callback({ success: false, msg: "Thread not found" });
          return;
        }

        socket.join(`thread:${threadId}`);

        await Promise.all([
          ChatMessage.updateMany(
            {
              threadId,
              senderAccountId: { $ne: socket.accountId },
              readBy: { $ne: socket.accountId },
            },
            { $push: { readBy: socket.accountId } }
          ),
          ChatThread.updateOne(
            { _id: threadId },
            { $set: { [`unread.${socket.accountRole}`]: 0 } }
          ),
        ]);

        emitThreadUpdate(io, thread);
        callback({ success: true, threadId });
      } catch (error) {
        callback({ success: false, msg: "Unable to join thread" });
      }
    });

    socket.on("chat:send-message", async (payload = {}, callback = () => {}) => {
      try {
        const threadId = toIdString(payload?.threadId);
        const text = String(payload?.text || "").trim();

        if (!mongoose.Types.ObjectId.isValid(threadId)) {
          callback({ success: false, msg: "Invalid thread id" });
          return;
        }

        if (!text) {
          callback({ success: false, msg: "Message is required" });
          return;
        }

        if (text.length > 2000) {
          callback({ success: false, msg: "Message is too long" });
          return;
        }

        const accessFilter = buildAccessFilter(threadId, socket.accountRole, socket.accountId);
        const thread = await ChatThread.findOne(accessFilter);

        if (!thread) {
          callback({ success: false, msg: "Thread not found" });
          return;
        }

        const message = await ChatMessage.create({
          threadId,
          senderAccountId: socket.accountId,
          senderRole: socket.accountRole,
          text,
          kind: "text",
          readBy: [socket.accountId],
        });

        const recipientUnreadField =
          socket.accountRole === "user" ? "unread.repairer" : "unread.user";
        const senderUnreadField =
          socket.accountRole === "user" ? "unread.user" : "unread.repairer";
        const now = message.createdAt || new Date();

        thread.lastMessage = {
          text,
          senderAccountId: socket.accountId,
          senderRole: socket.accountRole,
          createdAt: now,
        };
        thread.lastMessageAt = now;
        thread.set(recipientUnreadField, Number(thread.get(recipientUnreadField) || 0) + 1);
        thread.set(senderUnreadField, 0);
        await thread.save();

        const messagePayload = {
          id: toIdString(message._id),
          threadId,
          text: message.text,
          kind: message.kind || "text",
          senderAccountId: toIdString(message.senderAccountId),
          senderRole: message.senderRole,
          createdAt: message.createdAt,
        };

        io.to(`thread:${threadId}`).emit("chat:new-message", {
          threadId,
          message: messagePayload,
        });
        emitThreadUpdate(io, thread);

        callback({
          success: true,
          message: messagePayload,
        });
      } catch (error) {
        callback({ success: false, msg: "Unable to send message" });
      }
    });
  });
};
