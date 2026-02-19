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
  },

  role: {
    type: String,
    enum: ["user", "repairer", "admin"],
    default: "user"
  },

  isApproved: {
    type: Boolean,
    default: false
  },

  shopDetails: {
    shopName: String,
    experience: Number,
    skills: [String],
    address: String,
    city: String,
    pincode: String,
    location: {
      lat: Number,
      lng: Number
    },
    shopImage: String,
    idProof: String
  }
});

export default mongoose.model("user", UserNeuralSchema);
