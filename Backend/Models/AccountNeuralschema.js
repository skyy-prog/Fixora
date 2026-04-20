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

  phoneOtp: {
    type: String
  },

  phoneOtpExpire: {
    type: Date
  },

  pendingRepairerProfile: {
    type: mongoose.Schema.Types.Mixed
  },

  isVerified: {
    type: Boolean,
    default: false
  },
  role : String,
  preferredLanguage: {
    type: String,
    default: "en"
  }

}, { timestamps: true });

export default mongoose.model("Account", AccountSchema);
