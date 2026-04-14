import usermodel from "../Models/userNeuralSchema.js";
import Accounts from "../Models/AccountNeuralschema.js";
import mongoose from "mongoose";
import validator from "validator";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import axios from "axios";
import RepairerSchema from "../Models/RepairerNeuralSchema.js";
import { sendOTP } from "../Utils/Mailer.js";
const createToken = (id) => {
  return jwt.sign({ id }, process.env.JWT_SECRET, { expiresIn: "7d" });
};
export const UserSignIn = async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.json({ success: false, msg: "All fields are required" });
    }

    const account = await Accounts.findOne({ email });

    if (!account) {
      return res.json({
        success: false,
        msg: "User doesn't exist. Please register first.",
      });
    }

    const isMatch = await bcrypt.compare(password, account.password);

    if (!isMatch) {
      return res.json({ success: false, msg: "Invalid credentials" });
    }

    const userProfile = await usermodel.findOne({ accountId: account._id });
    const repairerProfile = await RepairerSchema.findOne({
      accountId: account._id,
    });

    let role = null;
    let profileData = null;
    let decision = false;
    if (userProfile) {
      role = "user";
      profileData = account.isVerified;
      decision = true;
    }

    if (repairerProfile) {
      role = "repairer";
      profileData = repairerProfile;
    }

    const token = createToken(account._id);

    res.cookie("token", token, {
      httpOnly: true,
      secure: false,
      sameSite: "lax",
      maxAge: 7 * 24 * 60 * 60 * 1000,
    });

    res.status(200).json({
      success: true,
      msg: "Login successful",
      role,
      profile: profileData,
      accountInfo: decision ? userProfile : repairerProfile,
    });
  } catch (error) {
    res.json({ success: false, msg: error.message });
  }
};
export const Singout = (rq, res) => {
  res.clearCookie("token", {
    httpOnly: true,
    secure: false,
    sameSite: "lax",
  });
  res.json({ success: true, msg: "Logged out successfully" });
};
export const Deleteuser = async (req, res) => {
  try {
    const { id } = req.body;
    if (!id) {
      return res.status(400).json({
        success: false,
        msg: "User ID is required",
      });
    }
 const user = await Accounts.findById(
  new mongoose.Types.ObjectId(id)
);
    if (!user) {
      return res.status(404).json({
        success: false,
        msg: "User not found",
      });
    }
    await Accounts.deleteOne({ _id: id });
    await usermodel.deleteMany({ accountId: id });
    res.clearCookie("token");
    return res.status(200).json({
      success: true,
      msg: "User deleted successfully",
    });
  } catch (error) {
    console.error(error);

    return res.status(500).json({
      success: false,
      msg: "Server Error",
    });
  }
};
export const veryfiyingtheotptrhroughregistration = async (req, res) => {
  const { email, otp } = req.body;

  const user = await Accounts.findOne({ email });

  if (!user) {
    return res.json({ success: false, msg: "User not found" });
  }

  if (user.otp !== otp) {
    return res.json({ success: false, msg: "Invalid OTP" });
  }

  if (user.otpExpire < Date.now()) {
    return res.json({ success: false, msg: "OTP Expired" });
  }

  user.isVerified = true;
  user.otp = null;
  user.otpExpire = null;
  await user.save();
  return res.json({ success: true, msg: "Verified Successfully" });
};

export const UserRegister = async (req, res) => {
  try {
    const { username, password, email, address, verifyuserorrepairer } =
      req.body;

    if (!username || !password || !email || !address || !verifyuserorrepairer) {
      return res.json({ success: false, msg: "Fill all the fields" });
    }
    console.log(email);
    if (!validator.isEmail(email)) {
      return res.json({ success: false, msg: "Enter valid email" });
    }

    const exists = await Accounts.findOne({ email });
    if (exists) {
      return res.json({ success: false, msg: "Already have account" });
    }

    const geoResponse = await axios.get(
      "https://nominatim.openstreetmap.org/search",
      {
        params: {
          q: address,
          format: "json",
          limit: 1,
        },
        headers: {
          "User-Agent": "FixoraApp",
        },
      },
    );

    if (!geoResponse.data.length) {
      return res.json({ success: false, msg: "Address invalid" });
    }

    const lat = parseFloat(geoResponse.data[0].lat);
    const lng = parseFloat(geoResponse.data[0].lon);

    const hashedPassword = await bcrypt.hash(password, 10);

    const otp = await sendOTP({ email });

    const account = await Accounts.create({
      email,
      password: hashedPassword,
      otp,
      otpExpire: Date.now() + 5 * 60 * 1000,
      isVerified: false,
      role: verifyuserorrepairer,
    });

    await usermodel.create({
      accountId: account._id,
      username,
      address,
      location: {
        latitude: lat,
        longitude: lng,
      },
    });

    return res.json({ success: true, msg: "OTP Sent to Email" });
  } catch (err) {
    console.log(err);
    res.json({ success: false, msg: "Server Error" });
  }
};
