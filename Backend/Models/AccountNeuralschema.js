import mongoose from "mongoose";

const AccountSchema = new mongoose.Schema({

  email: { 
    type: String, 
    required: true, 
    unique: true 
  },

  password: { 
    type: String, 
    required: true 
  },

  otp: {
    type: String
  },

  otpExpire: {
    type: Date
  },

  isVerified: {
    type: Boolean,
    default: false
  },
  role : String

}, { timestamps: true });

export default mongoose.model("Account", AccountSchema);