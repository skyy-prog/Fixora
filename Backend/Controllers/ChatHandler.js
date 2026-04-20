import mongoose from "mongoose";
import Accounts from "../Models/AccountNeuralschema.js";
import usermodel from "../Models/userNeuralSchema.js";
import RepairerSchema from "../Models/RepairerNeuralSchema.js";
import ChatThread from "../Models/ChatThreadSchema.js";
import ChatMessage from "../Models/ChatMessageSchema.js";

const CHAT_ROLES = new Set(["user", "repairer"]);

const toIdString = (value) => {
  if (!value) return "";
  return String(value);
};

const getAccountContext = async (accountId) => {
  if (!accountId || !mongoose.Types.ObjectId.isValid(accountId)) {
    return null;
  }

  const account = await Accounts.findById(accountId).select("role email").lean();
  if (!account || !CHAT_ROLES.has(account.role)) {
    return null;
  }

  return {
    accountId: toIdString(accountId),
    role: account.role,
    email: account.email || "",
  };
};

const buildCounterpartDetails = async (viewerRole, counterpartIds) => {
  const uniqueIds = [...new Set(counterpartIds.map((item) => toIdString(item)).filter(Boolean))];
  if (uniqueIds.length === 0) {
    return new Map();
  }

  const objectIds = uniqueIds
    .filter((id) => mongoose.Types.ObjectId.isValid(id))
    .map((id) => new mongoose.Types.ObjectId(id));

  const [accounts, repairers, users] = await Promise.all([
    Accounts.find({ _id: { $in: objectIds } })
      .select("_id email role")
      .lean(),
    viewerRole === "user"
      ? RepairerSchema.find({ accountId: { $in: objectIds } })
          .select("accountId username shopName shopImage city")
          .lean()
      : Promise.resolve([]),
    viewerRole === "repairer"
      ? usermodel.find({ accountId: { $in: objectIds } })
          .select("accountId username address")
          .lean()
      : Promise.resolve([]),
  ]);

  const accountMap = new Map(accounts.map((item) => [toIdString(item._id), item]));
  const repairerMap = new Map(repairers.map((item) => [toIdString(item.accountId), item]));
  const userMap = new Map(users.map((item) => [toIdString(item.accountId), item]));

  const result = new Map();

  uniqueIds.forEach((id) => {
    if (viewerRole === "user") {
      const repairer = repairerMap.get(id);
      const account = accountMap.get(id);
      result.set(id, {
        accountId: id,
        role: "repairer",
        name:
          repairer?.username ||
          account?.email?.split("@")?.[0] ||
          "Repairer",
        subtitle:
          [repairer?.shopName, repairer?.city].filter(Boolean).join(" • ") ||
          "Repairer",
        image: repairer?.shopImage || "",
      });
      return;
    }

    const user = userMap.get(id);
    const account = accountMap.get(id);
    result.set(id, {
      accountId: id,
      role: "user",
      name: user?.username || account?.email?.split("@")?.[0] || "User",
      subtitle: user?.address || "Customer",
      image: "",
    });
  });

  return result;
};

const buildThreadSummaries = async (threads, viewerRole) => {
  const counterpartIds = threads.map((thread) =>
    viewerRole === "user" ? thread.repairerAccountId : thread.userAccountId
  );

  const counterpartMap = await buildCounterpartDetails(viewerRole, counterpartIds);

  return threads.map((thread) => {
    const threadId = toIdString(thread._id);
    const counterpartId = toIdString(
      viewerRole === "user" ? thread.repairerAccountId : thread.userAccountId
    );
    const unreadCount =
      viewerRole === "user"
        ? Number(thread?.unread?.user || 0)
        : Number(thread?.unread?.repairer || 0);

    return {
      threadId,
      problemId: thread.problemId || "",
      problemTitle: thread.problemTitle || "Repair discussion",
      unreadCount,
      counterpart:
        counterpartMap.get(counterpartId) || {
          accountId: counterpartId,
          role: viewerRole === "user" ? "repairer" : "user",
          name: viewerRole === "user" ? "Repairer" : "User",
          subtitle: viewerRole === "user" ? "Repairer" : "Customer",
          image: "",
        },
      lastMessage: thread?.lastMessage?.text
        ? {
            text: thread.lastMessage.text,
            senderAccountId: toIdString(thread.lastMessage.senderAccountId),
            senderRole: thread.lastMessage.senderRole,
            createdAt: thread.lastMessage.createdAt || thread.lastMessageAt,
          }
        : null,
      updatedAt: thread.lastMessageAt || thread.updatedAt || thread.createdAt,
    };
  });
};

export const getChatInbox = async (req, res) => {
  try {
    const accountContext = await getAccountContext(req.accountId);
    if (!accountContext) {
      return res.status(401).json({
        success: false,
        msg: "Unauthorized",
      });
    }

    const threadFilter =
      accountContext.role === "user"
        ? { userAccountId: req.accountId }
        : { repairerAccountId: req.accountId };

    const threads = await ChatThread.find(threadFilter)
      .sort({ lastMessageAt: -1, updatedAt: -1 })
      .lean();

    const summaries = await buildThreadSummaries(threads, accountContext.role);

    return res.status(200).json({
      success: true,
      role: accountContext.role,
      threads: summaries,
    });
  } catch (error) {
    console.error("Get chat inbox error:", error);
    return res.status(500).json({
      success: false,
      msg: "Unable to load inbox",
    });
  }
};

export const getThreadMessages = async (req, res) => {
  try {
    const accountContext = await getAccountContext(req.accountId);
    if (!accountContext) {
      return res.status(401).json({
        success: false,
        msg: "Unauthorized",
      });
    }

    const { threadId } = req.params;
    if (!mongoose.Types.ObjectId.isValid(threadId)) {
      return res.status(400).json({
        success: false,
        msg: "Invalid thread id",
      });
    }

    const accessFilter =
      accountContext.role === "user"
        ? { _id: threadId, userAccountId: req.accountId }
        : { _id: threadId, repairerAccountId: req.accountId };

    const thread = await ChatThread.findOne(accessFilter).lean();
    if (!thread) {
      return res.status(404).json({
        success: false,
        msg: "Thread not found",
      });
    }

    const messages = await ChatMessage.find({ threadId })
      .sort({ createdAt: 1 })
      .limit(500)
      .lean();

    await Promise.all([
      ChatMessage.updateMany(
        {
          threadId,
          senderAccountId: { $ne: req.accountId },
          readBy: { $ne: req.accountId },
        },
        { $push: { readBy: req.accountId } }
      ),
      ChatThread.updateOne(
        { _id: threadId },
        {
          $set: {
            [`unread.${accountContext.role}`]: 0,
          },
        }
      ),
    ]);

    const normalizedThread = {
      ...thread,
      unread: {
        ...(thread?.unread || {}),
        [accountContext.role]: 0,
      },
    };
    const [summary] = await buildThreadSummaries([normalizedThread], accountContext.role);

    return res.status(200).json({
      success: true,
      thread: summary,
      messages: messages.map((item) => ({
        id: toIdString(item._id),
        threadId: toIdString(item.threadId),
        text: item.text,
        kind: item.kind || "text",
        senderAccountId: toIdString(item.senderAccountId),
        senderRole: item.senderRole,
        createdAt: item.createdAt,
      })),
    });
  } catch (error) {
    console.error("Get thread messages error:", error);
    return res.status(500).json({
      success: false,
      msg: "Unable to load messages",
    });
  }
};

export const bootstrapThread = async (req, res) => {
  try {
    const accountContext = await getAccountContext(req.accountId);
    if (!accountContext) {
      return res.status(401).json({
        success: false,
        msg: "Unauthorized",
      });
    }

    const problemId = String(req.body?.problemId || "").trim();
    const counterpartAccountId = String(req.body?.counterpartAccountId || "").trim();

    if (!problemId) {
      return res.status(400).json({
        success: false,
        msg: "Problem id is required",
      });
    }

    const problemOwner = await usermodel
      .findOne({ "PostData.problemId": problemId })
      .select("accountId PostData")
      .lean();

    if (!problemOwner) {
      return res.status(404).json({
        success: false,
        msg: "Problem not found",
      });
    }

    const post = Array.isArray(problemOwner?.PostData)
      ? problemOwner.PostData.find((item) => String(item?.problemId) === problemId)
      : null;

    if (!post) {
      return res.status(404).json({
        success: false,
        msg: "Problem not found",
      });
    }

    const userAccountId = toIdString(problemOwner.accountId);
    const repairRequests = Array.isArray(post?.repairRequests) ? post.repairRequests : [];
    let repairerAccountId = "";

    if (accountContext.role === "user") {
      if (accountContext.accountId !== userAccountId) {
        return res.status(403).json({
          success: false,
          msg: "You cannot access this chat",
        });
      }

      if (!counterpartAccountId || !mongoose.Types.ObjectId.isValid(counterpartAccountId)) {
        return res.status(400).json({
          success: false,
          msg: "Repairer account id is required",
        });
      }

      const hasRepairRequest = repairRequests.some(
        (requestItem) =>
          toIdString(requestItem?.repairerAccountId) === counterpartAccountId
      );
      if (!hasRepairRequest) {
        return res.status(403).json({
          success: false,
          msg: "No approved chat relationship found for this problem",
        });
      }

      repairerAccountId = counterpartAccountId;
    } else {
      const hasRepairRequest = repairRequests.some(
        (requestItem) =>
          toIdString(requestItem?.repairerAccountId) === accountContext.accountId
      );
      if (!hasRepairRequest) {
        return res.status(403).json({
          success: false,
          msg: "No approved chat relationship found for this problem",
        });
      }

      repairerAccountId = accountContext.accountId;
    }

    const problemTitle = String(post?.title || post?.problemTitle || "Repair discussion").trim();
    let thread = await ChatThread.findOne({
      userAccountId,
      repairerAccountId,
      problemId,
    });

    const relatedRequest = repairRequests.find(
      (requestItem) =>
        toIdString(requestItem?.repairerAccountId) === repairerAccountId
    );

    if (!thread) {
      thread = await ChatThread.create({
        userAccountId,
        repairerAccountId,
        problemId,
        problemTitle,
        participants: [
          { accountId: userAccountId, role: "user" },
          { accountId: repairerAccountId, role: "repairer" },
        ],
        unread: {
          user: 0,
          repairer: 0,
        },
      });
    }

    const existingMessageCount = await ChatMessage.countDocuments({ threadId: thread._id });
    if (
      existingMessageCount === 0 &&
      relatedRequest?.offerMessage &&
      String(relatedRequest.offerMessage).trim()
    ) {
      const backfilledMessage = await ChatMessage.create({
        threadId: thread._id,
        senderAccountId: repairerAccountId,
        senderRole: "repairer",
        text: String(relatedRequest.offerMessage).trim(),
        kind: "offer",
        readBy: [repairerAccountId],
      });

      thread.lastMessage = {
        text: backfilledMessage.text,
        senderAccountId: repairerAccountId,
        senderRole: "repairer",
        createdAt: backfilledMessage.createdAt,
      };
      thread.lastMessageAt = backfilledMessage.createdAt;
      thread.unread = {
        user: accountContext.role === "user" ? 0 : 1,
        repairer: 0,
      };
      await thread.save();
    }

    const [summary] = await buildThreadSummaries([thread.toObject()], accountContext.role);
    return res.status(200).json({
      success: true,
      thread: summary,
    });
  } catch (error) {
    console.error("Bootstrap thread error:", error);
    return res.status(500).json({
      success: false,
      msg: "Unable to bootstrap chat thread",
    });
  }
};
