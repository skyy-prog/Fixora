import mongoose from "mongoose";

const RepairerSchema = new mongoose.Schema({

  accountId: { 
    type: mongoose.Schema.Types.ObjectId, 
    ref: "Account",
    required: true,
    unique: true
  },

  username: { 
    type: String, 
    required: true, 
    trim: true 
  },

  personalPhone: { 
    type: String,
    match: [/^[0-9]{10}$/, "Invalid phone number"]
  },

  isPhoneVerified: {
    type: Boolean,
    default: false
  },

  shopName: { 
    type: String, 
    required: true 
  },

  shopImage: {
    type: String,
  },

  experience: { 
    type: Number, 
    default: 0,
    min: 0
  },

  skills: {
    type: [String],
    enum: ["electrician", "plumber", "carpenter", "mechanic", "ac_repair"]
  },

  address: String,
  city: String,
  pincode: String,

  shopPhone: {
    type: String,
    match: [/^[0-9]{10}$/, "Invalid phone number"]
  },

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

  availability: { 
    type: Boolean, 
    default: true 
  },

 
 
  status: {
    type: String,
    enum: ["incomplete", "pending", "approved", "rejected"],
    default: "incomplete"
  },
}, { timestamps: true });

RepairerSchema.index({ location: "2dsphere" });

export default mongoose.model("Repairer", RepairerSchema);
