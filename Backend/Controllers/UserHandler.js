import usermodel from "../Models/userNeuralSchema.js";
import Accounts from "../Models/AccountNeuralschema.js";
import mongoose from "mongoose";
import validator from "validator";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import axios from "axios";
import { sendOTP } from "../Utils/Mailer.js";
const createToken = (id) => {
  return jwt.sign({ id }, process.env.JWT_SECRET, { expiresIn: "7d" });
};

const SUPPORTED_LANGUAGES = new Set([
  "en",
  "as",
  "bn",
  "brx",
  "doi",
  "gu",
  "hi",
  "kn",
  "ks",
  "kok",
  "mai",
  "ml",
  "mni",
  "mr",
  "ne",
  "or",
  "pa",
  "sa",
  "sat",
  "sd",
  "ta",
  "te",
  "ur",
]);
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

    if (account.role !== "user") {
      return res.status(403).json({
        success: false,
        msg: "This account is registered as repairer. Please use repairer login.",
      });
    }

    const isMatch = await bcrypt.compare(password, account.password);

    if (!isMatch) {
      return res.json({ success: false, msg: "Invalid credentials" });
    }

    const userProfile = await usermodel.findOne({ accountId: account._id });
    if (!userProfile) {
      return res.status(404).json({
        success: false,
        msg: "User profile not found for this account",
      });
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
      role: "user",
      profile: account.isVerified,
      accountInfo: userProfile,
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

export const updatePreferredLanguage = async (req, res) => {
  try {
    const requestedLanguage = String(req.body?.language || "")
      .trim()
      .toLowerCase();

    if (!requestedLanguage) {
      return res.status(400).json({
        success: false,
        msg: "Language is required",
      });
    }

    if (!SUPPORTED_LANGUAGES.has(requestedLanguage)) {
      return res.status(400).json({
        success: false,
        msg: "Unsupported language",
      });
    }

    const account = await Accounts.findByIdAndUpdate(
      req.accountId,
      { preferredLanguage: requestedLanguage },
      { new: true }
    ).select("preferredLanguage");

    if (!account) {
      return res.status(404).json({
        success: false,
        msg: "Account not found",
      });
    }

    return res.status(200).json({
      success: true,
      msg: "Language updated",
      preferredLanguage: account.preferredLanguage,
    });
  } catch (error) {
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
    const {
      username,
      password,
      email,
      address,
      verifyuserorrepairer,
      preferredLanguage,
    } =
      req.body;

    if (!username || !password || !email || !address || !verifyuserorrepairer ) {
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
      preferredLanguage:
        SUPPORTED_LANGUAGES.has(String(preferredLanguage || "").toLowerCase())
          ? String(preferredLanguage).toLowerCase()
          : "en",
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
