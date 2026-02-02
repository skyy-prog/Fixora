import mongoose from "mongoose";

const ProblemSchema = new mongoose.Schema(
  {
    problemNumber: {
      type: Number,
      unique: true
    },

    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "user",
      required: true
    },

    userName: {
      type: String,
      required: true
    },

    deviceType: {
      type: String,
      enum: ["Laptop", "Mobile", "Tablet", "PC", "Other"],
      required: true
    },

    brand: {
      type: String,
      required: true
    },

    model: {
      type: String,
      required: true
    },

    problemTitle: {
      type: String,
      required: true
    },

    problemDescription: {
      type: String,
      required: true
    },

    budgetRange: {
      type: Number,
      required: true
    },

    urgency: {
      type: String,
      enum: ["Low", "Medium", "High"],
      default: "Low"
    },

    images: [
      {
        type: String    
      }
    ],

    location: {
      city: { type: String, required: true },
      state: { type: String, required: true },
      pincode: { type: String, required: true }
    },

    preferredRepairType: {
      type: String,
      enum: ["Visit Shop", "Home Service"],
      required: true
    },

    status: {
      type: String,
      enum: ["Open", "In Progress", "Completed", "Closed"],
      default: "Open"
    },

    tags: [
      {
        type: String
      }
    ],

    warrantyRequired: {
      type: Boolean,
      default: false
    }
  },
  {
    timestamps: true   // auto createdAt & updatedAt
  }
);

const problemModel =
  mongoose.models.problem || mongoose.model("problem", ProblemSchema);

export default problemModel;
