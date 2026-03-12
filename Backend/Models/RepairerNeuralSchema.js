import mongoose from "mongoose";
const RepairerSchema = new mongoose.Schema({

  accountId: { 
    type: mongoose.Schema.Types.ObjectId, 
    ref: "Account",
    required: true,
    unique: true
  },

  username: { type: String, required: true, trim: true },
  personalPhone: String,
  shopName: { type: String, required: true },
  experience: { type: Number, default: 0 },
  skills: [String],
  address: String,
  city: String,
  pincode: String,
  shopPhone: String,

  location: {
    type: {
      type: String,
      enum: ["Point"],
      default: "Point"
    },
    coordinates: {
      type: [Number],
      required: true
    }
  },

  availability: { type: Boolean, default: true },

  shopImage: {
    url: String,
    public_id: String
  },

  idProof: {
    url: String,
    public_id: String
  },

  isApproved: {
    type: Boolean,
    default: false
  },

  rating: {
    type: Number,
    default: 0
  }

}, { timestamps: true });

RepairerSchema.index({ location: "2dsphere" });

export default mongoose.model("Repairer", RepairerSchema);