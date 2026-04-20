import express from "express";
import { AuthMiddleware } from "../MiddleWare/AuthMiddleware.js";
import { bootstrapThread, getChatInbox, getThreadMessages } from "../Controllers/ChatHandler.js";

const ChatRouter = express.Router();

ChatRouter.get("/inbox", AuthMiddleware, getChatInbox);
ChatRouter.get("/threads/:threadId/messages", AuthMiddleware, getThreadMessages);
ChatRouter.post("/threads/bootstrap", AuthMiddleware, bootstrapThread);

export default ChatRouter;
