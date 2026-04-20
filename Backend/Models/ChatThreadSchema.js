import mongoose from "mongoose";

const ChatThreadSchema = new mongoose.Schema(
  {
    userAccountId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Account",
      required: true,
      index: true,
    },
    repairerAccountId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Account",
      required: true,
      index: true,
    },
    problemId: {
      type: String,
      required: true,
      trim: true,
      index: true,
    },
    problemTitle: {
      type: String,
      default: "",
      trim: true,
    },
    participants: [
      {
        accountId: {
          type: mongoose.Schema.Types.ObjectId,
          ref: "Account",
          required: true,
        },
        role: {
          type: String,
          enum: ["user", "repairer"],
          required: true,
        },
      },
    ],
    unread: {
      user: { type: Number, default: 0, min: 0 },
      repairer: { type: Number, default: 0, min: 0 },
    },
    lastMessage: {
      text: { type: String, default: "" },
      senderAccountId: { type: mongoose.Schema.Types.ObjectId, ref: "Account" },
      senderRole: { type: String, enum: ["user", "repairer"] },
      createdAt: { type: Date },
    },
    lastMessageAt: {
      type: Date,
      default: Date.now,
      index: true,
    },
  },
  { timestamps: true }
);

ChatThreadSchema.index(
  { userAccountId: 1, repairerAccountId: 1, problemId: 1 },
  { unique: true }
);

export default mongoose.model("ChatThread", ChatThreadSchema);
