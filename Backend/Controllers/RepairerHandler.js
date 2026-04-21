import Accounts from "../Models/AccountNeuralschema.js";
import {sendOTP} from "../Utils/Mailer.js";
import RepairerSchema from "../Models/RepairerNeuralSchema.js";
import { sendPhoneOTP } from "../Utils/SmsSender.js";
import jwt from "jsonwebtoken";
import validator from "validator";
import bcrypt from "bcrypt";
import axios from "axios";
import otpGenerator from "otp-generator";
import mongoose from "mongoose";
import fs from "fs";
import { v2 as cloudinary } from "cloudinary";
import usermodel from "../Models/userNeuralSchema.js";
import { calculateDistanceKm } from "../Utils/Distance.js";

const createToken = (id)=>{
    return jwt.sign({id} , process.env.JWT_SECRET , {expiresIn : "7d"});
}
const REPAIRER_SKILLS = ["electrician", "plumber", "carpenter", "mechanic", "ac_repair"];
const PROFILE_VALIDATION_ERRORS = [
  "All required profile fields must be provided",
  "Shop image is required",
  "Personal phone must be a valid 10-digit number",
  "Shop phone must be a valid 10-digit number",
  "Pincode must be a valid 6-digit number",
  "Experience must be a valid non-negative number",
  "One or more selected skills are invalid",
  "Address could not be geocoded",
  "Invalid geolocation coordinates for the address",
  "Invalid phone format for SMS delivery",
];

const toBoolean = (value, fallback = true) => {
  if (typeof value === "boolean") return value;
  if (typeof value === "string") {
    const normalized = value.trim().toLowerCase();
    if (normalized === "true") return true;
    if (normalized === "false") return false;
  }
  return fallback;
};

const uploadShopImageToCloudinary = async (file) => {
  if (!file?.path) {
    return "";
  }

  try {
    const uploadResult = await cloudinary.uploader.upload(file.path, {
      resource_type: "image",
      folder: "fixora/repairer-shops",
    });
    return uploadResult.secure_url;
  } finally {
    if (fs.existsSync(file.path)) {
      fs.unlinkSync(file.path);
    }
  }
};

const getViewerUserCoordinates = async (accountId) => {
  if (!accountId || !mongoose.Types.ObjectId.isValid(accountId)) {
    return null;
  }

  const account = await Accounts.findById(accountId).select("role");
  if (!account || account.role !== "user") {
    return null;
  }

  const userProfile = await usermodel
    .findOne({ accountId })
    .select("location")
    .lean();

  const latitude = Number(userProfile?.location?.latitude);
  const longitude = Number(userProfile?.location?.longitude);

  if (Number.isNaN(latitude) || Number.isNaN(longitude)) {
    return null;
  }

  return { latitude, longitude };
};

const mapRepairerReviews = (reviews = []) =>
  (Array.isArray(reviews) ? reviews : [])
    .map((reviewItem) => ({
      id: String(reviewItem?._id || ""),
      userAccountId: String(reviewItem?.userAccountId || ""),
      userName: reviewItem?.userName || "User",
      rating: Number(reviewItem?.rating || 0),
      review: reviewItem?.review || "",
      createdAt: reviewItem?.createdAt || null,
      updatedAt: reviewItem?.updatedAt || null,
    }))
    .sort((a, b) => new Date(b.createdAt || 0).getTime() - new Date(a.createdAt || 0).getTime());

const normalizeRepairerProfilePayload = async ({
  username,
  personalPhone,
  shopName,
  experience,
  skills,
  address,
  city,
  pincode,
  shopPhone,
  availability,
  shopImage,
}) => {
  if (!username || !personalPhone || !shopName || !address || !city || !pincode) {
    throw new Error("All required profile fields must be provided");
  }

  const trimmedUsername = String(username).trim();
  const trimmedShopName = String(shopName).trim();
  const trimmedAddress = String(address).trim();
  const trimmedCity = String(city).trim();
  const trimmedPincode = String(pincode).trim();
  const trimmedPersonalPhone = String(personalPhone).trim();
  const trimmedShopPhone = shopPhone ? String(shopPhone).trim() : "";

  if (!/^[0-9]{10}$/.test(trimmedPersonalPhone)) {
    throw new Error("Personal phone must be a valid 10-digit number");
  }

  if (trimmedShopPhone && !/^[0-9]{10}$/.test(trimmedShopPhone)) {
    throw new Error("Shop phone must be a valid 10-digit number");
  }

  if (!/^[0-9]{6}$/.test(trimmedPincode)) {
    throw new Error("Pincode must be a valid 6-digit number");
  }

  const normalizedExperience = Number(experience ?? 0);
  if (Number.isNaN(normalizedExperience) || normalizedExperience < 0) {
    throw new Error("Experience must be a valid non-negative number");
  }

  const normalizedSkills = Array.isArray(skills)
    ? skills
    : typeof skills === "string" && skills.length
      ? skills.split(",")
      : [];

  const cleanedSkills = normalizedSkills
    .map((item) => String(item).trim().toLowerCase())
    .filter(Boolean);

  const hasInvalidSkill = cleanedSkills.some((item) => !REPAIRER_SKILLS.includes(item));
  if (hasInvalidSkill) {
    throw new Error("One or more selected skills are invalid");
  }

  const geoResponse = await axios.get(
    "https://nominatim.openstreetmap.org/search",
    {
      params: {
        q: `${trimmedAddress}, ${trimmedCity}, ${trimmedPincode}`,
        format: "json",
        limit: 1,
      },
      headers: {
        "User-Agent": "FixoraApp",
      },
    }
  );

  if (!Array.isArray(geoResponse.data) || geoResponse.data.length === 0) {
    throw new Error("Address could not be geocoded");
  }

  const latitude = Number(geoResponse.data[0].lat);
  const longitude = Number(geoResponse.data[0].lon);

  if (Number.isNaN(latitude) || Number.isNaN(longitude)) {
    throw new Error("Invalid geolocation coordinates for the address");
  }

  return {
    username: trimmedUsername,
    personalPhone: trimmedPersonalPhone,
    shopName: trimmedShopName,
    experience: normalizedExperience,
    skills: cleanedSkills,
    address: trimmedAddress,
    city: trimmedCity,
    pincode: trimmedPincode,
    shopPhone: trimmedShopPhone || undefined,
    availability: toBoolean(availability, true),
    shopImage: shopImage || undefined,
    location: {
      type: "Point",
      coordinates: [longitude, latitude],
    },
    status: "pending",
  };
};

export const registerRepairer = async (req, res) => {
  try {
    let {email, password } = req.body;

    // 🔒 Normalize email
    email = email.toLowerCase();

    // ✅ Validations
    if ( !email || !password) {
      return res.status(400).json({
        success: false,
        msg: "All fields are required",
      });
    }

    if (!validator.isEmail(email)) {
      return res.status(400).json({
        success: false,
        msg: "Invalid email format",
      });
    }

    if (password.length < 6 || password.length > 50) {
      return res.status(400).json({
        success: false,
        msg: "Password must be between 6 and 50 characters",
      });
    }

    if (!/[A-Z]/.test(password)) {
      return res.status(400).json({
        success: false,
        msg: "Password must contain at least one uppercase letter",
      });
    }

    if (!/[a-z]/.test(password)) {
      return res.status(400).json({
        success: false,
        msg: "Password must contain at least one lowercase letter",
      });
    }

    if (!/[0-9]/.test(password)) {
      return res.status(400).json({
        success: false,
        msg: "Password must contain at least one number",
      });
    }

    if (!/[!@#$%^&*]/.test(password)) {
      return res.status(400).json({
        success: false,
        msg: "Password must contain at least one special character",
      });
    }

    // 🔍 Check existing account
    const existingAccount = await Accounts.findOne({ email });

    if (existingAccount) {
      if (!existingAccount.isVerified) {
        const otp = await sendOTP({ email });

        existingAccount.otp = otp;
        existingAccount.otpExpire = Date.now() + 5 * 60 * 1000;
        await existingAccount.save();

        return res.status(200).json({
          success: true,
          msg: "OTP resent to your email",
        });
      }

      return res.status(400).json({
        success: false,
        msg: "Account with this email already exists",
      });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const otp = await sendOTP({ email });

    const account = await Accounts.create({
      email,
      password: hashedPassword,
      otp,
      otpExpire: Date.now() + 5 * 60 * 1000,
      isVerified: false,
      role: "repairer",
    });

    return res.status(201).json({
      success: true,
      msg: "OTP sent successfully",
      accountId: account._id,
    });
  } catch (error) {
    console.error("Register Error:", error);

    return res.status(500).json({
      success: false,
      msg: "Error in registration",
    });
  }
};


export const verifyOTP = async (req, res) => {
  try {
    const { accountId, otp } = req.body;   
    if (!accountId || !otp) {
        return res.status(400).json({   
            success: false,
            msg: "Account ID and OTP are required"
        });
    }
    const account = await Accounts.findById(accountId);
    if (!account) {
        return res.status(404).json({
            success: false,
            msg: "Account not found"
        });
    }   
    if (account.isVerified) {
        return res.status(400).json({
            success: false,
            msg: "Account is already verified"
        });
    }
    if (account.otp !== otp) {
        return res.status(400).json({
            success: false,
            msg: "Invalid OTP"
        });
    }
    if (account.otpExpire < Date.now()) {
        return res.status(400).json({
            success: false,
            msg: "OTP has expired"
        });
    }
    account.isVerified = true;
    account.otp = null;
    account.otpExpire = null;   
    await account.save();
    const token = createToken(account._id);
    res.cookie("token", token, {
      httpOnly: true,
      secure: false,
      sameSite: "lax",
      maxAge: 7 * 24 * 60 * 60 * 1000,
    });
    return res.status(200).json({
        success: true,
        msg: "Account verified successfully"
    });
  } catch (error) {
    console.error("OTP Verification Error:", error);
    return res.status(500).json({ 
        success: false,
        msg: "Error in OTP verification"
    });
    }
};

 export const repairerLogin = async (req, res) => {
  try{
       let { email, password } = req.body;
    if (!email || !password) {
        return res.status(400).json({
            success: false,
            msg: "Email and password are required"
        });
    }
    email = email.toLowerCase();
    const account = await Accounts.findOne({email});
    if (!account) {
        return res.status(404).json({
            success: false,
            msg: "Repairer account not found"
        });
    }

    if (account.role !== "repairer") {
      return res.status(403).json({
        success: false,
        msg: "This account is registered as user. Please use user login.",
      });
    }

    //////1234567890Gg~@@>{}+
    if (!account.isVerified) {
        return res.status(400).json({
            success: false,
            msg: "Account is not verified"
        });
    }
    const isMatch = await bcrypt.compare(password, account.password);
    if (!isMatch) {
        return res.status(400).json({
            success: false,
            msg: "Invalid password"
        });
    }
    const token = createToken(account._id);
    res.cookie("token", token, {
      httpOnly: true,
      secure: false,
      sameSite: "lax",
      maxAge: 7 * 24 * 60 * 60 * 1000,
    });

    return res.status(200).json({
        success: true,
        msg: "Login successful"
    });
  }catch(error){
    console.error("Login Error:", error);
    return res.status(500).json({
        success: false,
        msg: "Error in login"
    });
  }
}

export const sendRepairerPhoneOTP = async (req, res) => {
  try {
    const account = await Accounts.findById(req.accountId);

    if (!account) {
      return res.status(404).json({
        success: false,
        msg: "Account not found",
      });
    }

    if (account.role !== "repairer") {
      return res.status(403).json({
        success: false,
        msg: "Only repairer accounts can create repairer profile",
      });
    }

    if (!account.isVerified) {
      return res.status(400).json({
        success: false,
        msg: "Please verify your email before creating repairer profile",
      });
    }

    const alreadyVerifiedRepairer = await RepairerSchema.findOne({
      accountId: req.accountId,
      isPhoneVerified: true,
    });

    if (alreadyVerifiedRepairer) {
      return res.status(400).json({
        success: false,
        msg: "Repairer profile already exists and is verified",
      });
    }

    if (!req.file?.path) {
      throw new Error("Shop image is required");
    }

    const shopImage = await uploadShopImageToCloudinary(req.file);
    const normalizedProfile = await normalizeRepairerProfilePayload({
      ...req.body,
      shopImage,
    });

    const otp = otpGenerator.generate(6, {
      upperCaseAlphabets: false,
      lowerCaseAlphabets: false,
      specialChars: false,
      digits: true,
    });

    await sendPhoneOTP({
      phone: normalizedProfile.personalPhone,
      otp,
    });

    account.phoneOtp = otp;
    account.phoneOtpExpire = Date.now() + 5 * 60 * 1000;
    account.pendingRepairerProfile = normalizedProfile;
    await account.save();

    return res.status(200).json({
      success: true,
      msg: "OTP sent to your mobile number",
    });
  } catch (error) {
    console.error("Repairer profile OTP send error:", error);
    const statusCode = PROFILE_VALIDATION_ERRORS.includes(error.message) ? 400 : 500;
    return res.status(statusCode).json({
      success: false,
      msg: error.message || "Unable to send OTP",
    });
  }
};

export const verifyRepairerPhoneOTP = async (req, res) => {
  try {
    const { otp } = req.body;

    if (!otp) {
      return res.status(400).json({
        success: false,
        msg: "OTP is required",
      });
    }

    const account = await Accounts.findById(req.accountId);
    if (!account) {
      return res.status(404).json({
        success: false,
        msg: "Account not found",
      });
    }

    if (account.role !== "repairer") {
      return res.status(403).json({
        success: false,
        msg: "Only repairer accounts can verify repairer profile",
      });
    }

    if (!account.phoneOtp || !account.phoneOtpExpire || !account.pendingRepairerProfile) {
      return res.status(400).json({
        success: false,
        msg: "No pending mobile verification found. Submit profile details first.",
      });
    }

    if (String(account.phoneOtp) !== String(otp)) {
      return res.status(400).json({
        success: false,
        msg: "Invalid OTP",
      });
    }

    if (account.phoneOtpExpire < Date.now()) {
      return res.status(400).json({
        success: false,
        msg: "OTP has expired",
      });
    }

    const profilePayload = account.pendingRepairerProfile;
    const profileData = {
      ...profilePayload,
      accountId: req.accountId,
      isPhoneVerified: true,
      status: "pending",
    };

    const repairerProfile = await RepairerSchema.findOneAndUpdate(
      { accountId: req.accountId },
      profileData,
      {
        new: true,
        upsert: true,
        runValidators: true,
        setDefaultsOnInsert: true,
      }
    );

    account.phoneOtp = null;
    account.phoneOtpExpire = null;
    account.pendingRepairerProfile = null;
    await account.save();

    return res.status(200).json({
      success: true,
      msg: "Mobile verified and repairer profile created successfully",
      repairerProfile,
    });
  } catch (error) {
    console.error("Repairer profile OTP verify error:", error);
    return res.status(500).json({
      success: false,
      msg: error.message || "Unable to verify OTP",
    });
  }
};

export const updateRepairerProfile = async (req, res) => {
  try {
    const account = await Accounts.findById(req.accountId);
    if (!account) {
      return res.status(404).json({
        success: false,
        msg: "Account not found",
      });
    }

    if (account.role !== "repairer") {
      return res.status(403).json({
        success: false,
        msg: "Only repairer accounts can update profile",
      });
    }

    const existingProfile = await RepairerSchema.findOne({ accountId: req.accountId });
    if (!existingProfile || !existingProfile.isPhoneVerified) {
      return res.status(400).json({
        success: false,
        msg: "Complete and verify your repairer profile first",
      });
    }

    const uploadedShopImage = await uploadShopImageToCloudinary(req.file);
    const normalizedProfile = await normalizeRepairerProfilePayload({
      ...req.body,
      shopImage: uploadedShopImage || existingProfile.shopImage,
    });
    const updatedProfileData = {
      ...normalizedProfile,
      accountId: req.accountId,
      isPhoneVerified: true,
      status: existingProfile.status || "pending",
    };

    const updatedProfile = await RepairerSchema.findOneAndUpdate(
      { accountId: req.accountId },
      updatedProfileData,
      {
        new: true,
        runValidators: true,
      }
    );

    return res.status(200).json({
      success: true,
      msg: "Profile updated successfully",
      repairerProfile: updatedProfile,
    });
  } catch (error) {
    console.error("Repairer profile update error:", error);
    const statusCode = PROFILE_VALIDATION_ERRORS.includes(error.message) ? 400 : 500;
    return res.status(statusCode).json({
      success: false,
      msg: error.message || "Unable to update profile",
    });
  }
};

export const submitRepairerReview = async (req, res) => {
  try {
    const { id } = req.params;
    const rating = Number(req.body?.rating);
    const reviewText = String(req.body?.review || "").trim();

    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({
        success: false,
        msg: "Invalid repairer id",
      });
    }

    if (!Number.isFinite(rating) || rating < 1 || rating > 5) {
      return res.status(400).json({
        success: false,
        msg: "Rating must be between 1 and 5",
      });
    }

    if (reviewText.length < 3) {
      return res.status(400).json({
        success: false,
        msg: "Review must be at least 3 characters",
      });
    }

    const account = await Accounts.findById(req.accountId).select("role email");
    if (!account) {
      return res.status(401).json({
        success: false,
        msg: "Account not found",
      });
    }

    if (account.role !== "user") {
      return res.status(403).json({
        success: false,
        msg: "Only users can submit repairer reviews",
      });
    }

    const userProfile = await usermodel.findOne({ accountId: req.accountId }).select("username");
    const reviewerName = String(
      userProfile?.username || account?.email?.split("@")?.[0] || "User"
    ).trim();

    const repairer = await RepairerSchema.findOne({
      _id: id,
      isPhoneVerified: true,
    });

    if (!repairer) {
      return res.status(404).json({
        success: false,
        msg: "Repairer not found",
      });
    }

    if (String(repairer.accountId) === String(req.accountId)) {
      return res.status(400).json({
        success: false,
        msg: "You cannot review your own profile",
      });
    }

    const existingReviews = Array.isArray(repairer.reviews) ? repairer.reviews : [];
    repairer.reviews = existingReviews;

    const existingReviewIndex = repairer.reviews.findIndex(
      (reviewItem) => String(reviewItem?.userAccountId) === String(req.accountId)
    );

    if (existingReviewIndex >= 0) {
      repairer.reviews[existingReviewIndex].rating = rating;
      repairer.reviews[existingReviewIndex].review = reviewText;
      repairer.reviews[existingReviewIndex].userName = reviewerName;
      repairer.reviews[existingReviewIndex].updatedAt = new Date();
    } else {
      repairer.reviews.push({
        userAccountId: req.accountId,
        userName: reviewerName,
        rating,
        review: reviewText,
      });
    }

    const totalReviews = repairer.reviews.length;
    const averageRating =
      totalReviews > 0
        ? repairer.reviews.reduce((sum, item) => sum + Number(item?.rating || 0), 0) / totalReviews
        : 0;

    repairer.totalReviews = totalReviews;
    repairer.rating = Number(averageRating.toFixed(1));
    await repairer.save();

    return res.status(200).json({
      success: true,
      msg: existingReviewIndex >= 0 ? "Review updated successfully" : "Review submitted successfully",
      repairer: {
        id: String(repairer._id),
        rating: repairer.rating,
        totalReviews: repairer.totalReviews,
        reviews: mapRepairerReviews(repairer.reviews),
      },
    });
  } catch (error) {
    console.error("Submit repairer review error:", error);
    return res.status(500).json({
      success: false,
      msg: "Unable to submit review",
    });
  }
};

export const getPublicRepairers = async (req, res) => {
  try {
    const viewerCoordinates = await getViewerUserCoordinates(req.accountId);

    const repairers = await RepairerSchema.find({ isPhoneVerified: true })
      .sort({ createdAt: -1 })
      .select("-__v")
      .lean();

    const repairersWithDistance = repairers.map((repairer) => {
      if (!viewerCoordinates) {
        return {
          ...repairer,
          distanceFromUserKm: null,
        };
      }

      const coordinates = Array.isArray(repairer?.location?.coordinates)
        ? repairer.location.coordinates
        : [];

      const repairerLongitude = Number(coordinates[0]);
      const repairerLatitude = Number(coordinates[1]);
      const distanceFromUserKm = calculateDistanceKm(
        viewerCoordinates.latitude,
        viewerCoordinates.longitude,
        repairerLatitude,
        repairerLongitude
      );

      return {
        ...repairer,
        distanceFromUserKm,
      };
    });

    return res.status(200).json({
      success: true,
      repairers: repairersWithDistance,
    });
  } catch (error) {
    console.error("Get public repairers error:", error);
    return res.status(500).json({
      success: false,
      msg: "Unable to fetch repairers",
    });
  }
};

export const getPublicRepairerById = async (req, res) => {
  try {
    const { id } = req.params;
    const viewerCoordinates = await getViewerUserCoordinates(req.accountId);

    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({
        success: false,
        msg: "Invalid repairer id",
      });
    }

    const repairer = await RepairerSchema.findOne({
      _id: id,
      isPhoneVerified: true,
    }).select("-__v").lean();

    if (!repairer) {
      return res.status(404).json({
        success: false,
        msg: "Repairer not found",
      });
    }

    const coordinates = Array.isArray(repairer?.location?.coordinates)
      ? repairer.location.coordinates
      : [];
    const repairerLongitude = Number(coordinates[0]);
    const repairerLatitude = Number(coordinates[1]);
    const distanceFromUserKm = viewerCoordinates
      ? calculateDistanceKm(
          viewerCoordinates.latitude,
          viewerCoordinates.longitude,
          repairerLatitude,
          repairerLongitude
        )
      : null;

    return res.status(200).json({
      success: true,
      repairer: {
        ...repairer,
        distanceFromUserKm,
        reviews: mapRepairerReviews(repairer?.reviews),
      },
    });
  } catch (error) {
    console.error("Get public repairer by id error:", error);
    return res.status(500).json({
      success: false,
      msg: "Unable to fetch repairer profile",
    });
  }
};
