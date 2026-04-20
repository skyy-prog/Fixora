import mongoose from "mongoose";

const ChatMessageSchema = new mongoose.Schema(
  {
    threadId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "ChatThread",
      required: true,
      index: true,
    },
    senderAccountId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Account",
      required: true,
      index: true,
    },
    senderRole: {
      type: String,
      enum: ["user", "repairer"],
      required: true,
    },
    text: {
      type: String,
      required: true,
      trim: true,
      maxlength: 2000,
    },
    kind: {
      type: String,
      enum: ["text", "offer", "system"],
      default: "text",
    },
    readBy: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Account",
      },
    ],
  },
  { timestamps: true }
);

ChatMessageSchema.index({ threadId: 1, createdAt: 1 });

export default mongoose.model("ChatMessage", ChatMessageSchema);
