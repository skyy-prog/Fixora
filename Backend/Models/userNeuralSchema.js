import mongoose from "mongoose";
const UserNeuralSchema = new mongoose.Schema({
  username: String,
  email: String,
  password: String,
  otp: String,
  otpExpire: Date,
  isVerified: {
    type: Boolean,
    default: false
  }
});

export default mongoose.model("user", UserNeuralSchema);
