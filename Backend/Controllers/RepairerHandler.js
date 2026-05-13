import Accounts from "../Models/AccountNeuralschema.js";
import RepairerSchema from "../Models/RepairerNeuralSchema.js";
import jwt from "jsonwebtoken";
import validator from "validator";
import bcrypt from "bcrypt";
import axios from "axios";
import mongoose from "mongoose";
import fs from "fs";
import { v2 as cloudinary } from "cloudinary";
import usermodel from "../Models/userNeuralSchema.js";
import { calculateDistanceKm } from "../Utils/Distance.js";
import {
  generateRegistrationOptions,
  verifyRegistrationResponse,
  generateAuthenticationOptions,
  verifyAuthenticationResponse,
} from "@simplewebauthn/server";

const createToken = (id)=>{
    return jwt.sign({id} , process.env.JWT_SECRET , {expiresIn : "7d"});
}
const REPAIRER_SKILLS = [
  "electrician",
  "plumber",
  "carpenter",
  "mechanic",
  "ac_repair",
  "painter",
  "welder",
  "mason",
  "cctv_security",
  "appliance_repair",
  "pest_control",
  "gardener",
  "glass_work",
  "waterproofing",
  "flooring",
  "solar_panels",
  "internet_networking",
  "false_ceiling",
];
const PROFILE_VALIDATION_ERRORS = [
  "All required profile fields must be provided",
  "Shop image is required",
  "Identity document image is required",
  "Selfie image is required",
  "Skill proof image is required",
  "Selfie declaration code is required",
  "Personal phone must be a valid 10-digit number",
  "Shop phone must be a valid 10-digit number",
  "Pincode must be a valid 6-digit number",
  "Experience must be a valid non-negative number",
  "One or more selected skills are invalid",
  "Address could not be geocoded",
  "Invalid geolocation coordinates for the address",
  "Only approved repairers can update profile details",
];

const PASSKEY_RP_NAME = process.env.PASSKEY_RP_NAME || "Fixora";
const PASSKEY_RP_ID = process.env.PASSKEY_RP_ID || "localhost";
const PASSKEY_ORIGIN = process.env.PASSKEY_ORIGIN || "http://localhost:5173";
const PASSKEY_CHALLENGE_TIMEOUT_MS = 5 * 60 * 1000;

const toBoolean = (value, fallback = true) => {
  if (typeof value === "boolean") return value;
  if (typeof value === "string") {
    const normalized = value.trim().toLowerCase();
    if (normalized === "true") return true;
    if (normalized === "false") return false;
  }
  return fallback;
};

const uploadImageToCloudinary = async (file, folder = "fixora/repairer-shops") => {
  if (!file?.path) {
    return "";
  }

  try {
    const uploadResult = await cloudinary.uploader.upload(file.path, {
      resource_type: "image",
      folder,
    });
    return uploadResult.secure_url;
  } finally {
    if (fs.existsSync(file.path)) {
      fs.unlinkSync(file.path);
    }
  }
};

const getUploadedFile = (req, fieldName) => {
  if (req?.files && Array.isArray(req.files[fieldName]) && req.files[fieldName][0]) {
    return req.files[fieldName][0];
  }
  if (req?.file && fieldName === "shopImage") {
    return req.file;
  }
  return null;
};

const getRepairerVerificationState = (repairerProfile) => {
  const status = String(repairerProfile?.status || "incomplete").toLowerCase();
  const approved = status === "approved";
  return {
    status,
    approved,
    canApproachCustomers: approved && Boolean(repairerProfile?.isPhoneVerified),
  };
};

const ensureAdminReviewAccess = (req, res) => {
  const providedAdminKey = String(req.headers?.["x-admin-key"] || "").trim();
  const configuredAdminKey = String(process.env.REPAIRER_ADMIN_KEY || "").trim();

  if (!configuredAdminKey) {
    res.status(500).json({
      success: false,
      msg: "REPAIRER_ADMIN_KEY is not configured on server",
    });
    return false;
  }

  if (providedAdminKey !== configuredAdminKey) {
    res.status(401).json({
      success: false,
      msg: "Unauthorized review request",
    });
    return false;
  }

  return true;
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

  const hasInvalidSkill = cleanedSkills.some(
    (item) => !REPAIRER_SKILLS.includes(item) && !/^[a-z0-9_]{2,40}$/.test(item)
  );
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

    // Normalize email
    email = String(email || "").trim().toLowerCase();

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

    const existingAccount = await Accounts.findOne({ email });

    if (existingAccount) {
      if (existingAccount.role !== "repairer") {
        return res.status(403).json({
          success: false,
          msg: "This email is already registered as user. Please use user login.",
        });
      }

      return res.status(400).json({
        success: false,
        msg: "Account with this email already exists",
      });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const account = await Accounts.create({
      email,
      password: hashedPassword,
      otp: null,
      otpExpire: null,
      isVerified: true,
      role: "repairer",
    });

    const token = createToken(account._id);
    res.cookie("token", token, {
      httpOnly: true,
      secure: false,
      sameSite: "lax",
      maxAge: 7 * 24 * 60 * 60 * 1000,
    });

    return res.status(201).json({
      success: true,
      msg: "Repairer account created successfully",
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

export const startRepairerPasskeyRegistration = async (req, res) => {
  try {
    const account = await Accounts.findById(req.accountId).select("role email passkeys");
    if (!account) {
      return res.status(404).json({
        success: false,
        msg: "Account not found",
      });
    }

    if (account.role !== "repairer") {
      return res.status(403).json({
        success: false,
        msg: "Only repairers can register passkeys",
      });
    }

    const passkeys = Array.isArray(account.passkeys) ? account.passkeys : [];
    const options = await generateRegistrationOptions({
      rpName: PASSKEY_RP_NAME,
      rpID: PASSKEY_RP_ID,
      userID: new TextEncoder().encode(String(account._id)),
      userName: account.email,
      userDisplayName: account.email,
      timeout: PASSKEY_CHALLENGE_TIMEOUT_MS,
      attestationType: "none",
      authenticatorSelection: {
        residentKey: "preferred",
        userVerification: "preferred",
      },
      excludeCredentials: passkeys.map((passkeyItem) => ({
        id: passkeyItem.credentialID,
        transports: Array.isArray(passkeyItem.transports) ? passkeyItem.transports : [],
      })),
    });

    account.passkeyChallenge = options.challenge;
    await account.save();

    return res.status(200).json({
      success: true,
      options,
    });
  } catch (error) {
    console.error("Passkey registration options error:", error);
    return res.status(500).json({
      success: false,
      msg: "Unable to start passkey registration",
    });
  }
};

export const finishRepairerPasskeyRegistration = async (req, res) => {
  try {
    const attestationResponse = req.body?.attestationResponse || req.body?.credential;
    if (!attestationResponse) {
      return res.status(400).json({
        success: false,
        msg: "Passkey response is required",
      });
    }

    const account = await Accounts.findById(req.accountId).select("role passkeys passkeyChallenge");
    if (!account) {
      return res.status(404).json({
        success: false,
        msg: "Account not found",
      });
    }

    if (account.role !== "repairer") {
      return res.status(403).json({
        success: false,
        msg: "Only repairers can register passkeys",
      });
    }

    if (!account.passkeyChallenge) {
      return res.status(400).json({
        success: false,
        msg: "Passkey registration challenge not found. Start again.",
      });
    }

    const verification = await verifyRegistrationResponse({
      response: attestationResponse,
      expectedChallenge: account.passkeyChallenge,
      expectedOrigin: PASSKEY_ORIGIN,
      expectedRPID: PASSKEY_RP_ID,
      requireUserVerification: false,
    });

    if (!verification?.verified || !verification.registrationInfo?.credential) {
      return res.status(400).json({
        success: false,
        msg: "Passkey registration could not be verified",
      });
    }

    const credential = verification.registrationInfo.credential;
    const credentialID = String(credential.id || "");
    if (!credentialID) {
      return res.status(400).json({
        success: false,
        msg: "Invalid passkey credential",
      });
    }

    const existingPasskeys = Array.isArray(account.passkeys) ? account.passkeys : [];
    const alreadyExists = existingPasskeys.some(
      (passkeyItem) => String(passkeyItem?.credentialID) === credentialID
    );

    if (!alreadyExists) {
      existingPasskeys.push({
        credentialID,
        credentialPublicKey: Buffer.from(credential.publicKey).toString("base64"),
        counter: Number(credential.counter || 0),
        transports: Array.isArray(credential.transports) ? credential.transports : [],
        deviceType: verification.registrationInfo.credentialDeviceType || "singleDevice",
        backedUp: Boolean(verification.registrationInfo.credentialBackedUp),
      });
      account.passkeys = existingPasskeys;
    }

    account.passkeyChallenge = null;
    await account.save();

    return res.status(200).json({
      success: true,
      msg: "Passkey registered successfully",
    });
  } catch (error) {
    console.error("Passkey registration verify error:", error);
    return res.status(500).json({
      success: false,
      msg: "Unable to verify passkey registration",
    });
  }
};

export const startRepairerPasskeyLogin = async (req, res) => {
  try {
    const email = String(req.body?.email || "").trim().toLowerCase();
    if (!email || !validator.isEmail(email)) {
      return res.status(400).json({
        success: false,
        msg: "Valid email is required",
      });
    }

    const account = await Accounts.findOne({ email }).select("role passkeys");
    if (!account || account.role !== "repairer") {
      return res.status(404).json({
        success: false,
        msg: "Repairer account not found",
      });
    }

    const passkeys = Array.isArray(account.passkeys) ? account.passkeys : [];
    if (passkeys.length === 0) {
      return res.status(400).json({
        success: false,
        msg: "No passkey is registered for this account",
      });
    }

    const options = await generateAuthenticationOptions({
      rpID: PASSKEY_RP_ID,
      timeout: PASSKEY_CHALLENGE_TIMEOUT_MS,
      allowCredentials: passkeys.map((passkeyItem) => ({
        id: passkeyItem.credentialID,
        transports: Array.isArray(passkeyItem.transports) ? passkeyItem.transports : [],
      })),
      userVerification: "preferred",
    });

    account.passkeyChallenge = options.challenge;
    await account.save();

    return res.status(200).json({
      success: true,
      options,
    });
  } catch (error) {
    console.error("Passkey login options error:", error);
    return res.status(500).json({
      success: false,
      msg: "Unable to start passkey login",
    });
  }
};

export const finishRepairerPasskeyLogin = async (req, res) => {
  try {
    const email = String(req.body?.email || "").trim().toLowerCase();
    const assertionResponse = req.body?.assertionResponse || req.body?.credential;
    if (!email || !validator.isEmail(email) || !assertionResponse) {
      return res.status(400).json({
        success: false,
        msg: "Email and passkey response are required",
      });
    }

    const account = await Accounts.findOne({ email }).select(
      "role isVerified passkeys passkeyChallenge"
    );
    if (!account || account.role !== "repairer") {
      return res.status(404).json({
        success: false,
        msg: "Repairer account not found",
      });
    }

    if (!account.passkeyChallenge) {
      return res.status(400).json({
        success: false,
        msg: "Passkey login challenge not found. Start again.",
      });
    }

    const credentialID = String(assertionResponse?.id || "");
    const passkeys = Array.isArray(account.passkeys) ? account.passkeys : [];
    const matchingPasskey = passkeys.find(
      (passkeyItem) => String(passkeyItem?.credentialID) === credentialID
    );

    if (!matchingPasskey) {
      return res.status(400).json({
        success: false,
        msg: "Passkey is not registered for this account",
      });
    }

    const verification = await verifyAuthenticationResponse({
      response: assertionResponse,
      expectedChallenge: account.passkeyChallenge,
      expectedOrigin: PASSKEY_ORIGIN,
      expectedRPID: PASSKEY_RP_ID,
      requireUserVerification: false,
      credential: {
        id: matchingPasskey.credentialID,
        publicKey: Buffer.from(String(matchingPasskey.credentialPublicKey || ""), "base64"),
        counter: Number(matchingPasskey.counter || 0),
        transports: Array.isArray(matchingPasskey.transports) ? matchingPasskey.transports : [],
      },
    });

    if (!verification?.verified) {
      return res.status(400).json({
        success: false,
        msg: "Passkey login verification failed",
      });
    }

    matchingPasskey.counter = Number(verification.authenticationInfo?.newCounter || 0);
    account.passkeyChallenge = null;
    if (!account.isVerified) {
      account.isVerified = true;
    }
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
      msg: "Passkey login successful",
    });
  } catch (error) {
    console.error("Passkey login verify error:", error);
    return res.status(500).json({
      success: false,
      msg: "Unable to verify passkey login",
    });
  }
};


export const repairerLogin = async (req, res) => {
  try {
    let { email, password } = req.body;
    if (!email || !password) {
      return res.status(400).json({
        success: false,
        msg: "Email and password are required",
      });
    }
    email = String(email || "").trim().toLowerCase();
    const account = await Accounts.findOne({ email }).select("password role isVerified passkeys");
    if (!account) {
      return res.status(404).json({
        success: false,
        msg: "Repairer account not found",
      });
    }

    if (account.role !== "repairer") {
      return res.status(403).json({
        success: false,
        msg: "This account is registered as user. Please use user login.",
      });
    }

    const isMatch = await bcrypt.compare(password, account.password);
    if (!isMatch) {
      return res.status(400).json({
        success: false,
        msg: "Invalid password",
      });
    }

    if (!account.isVerified) {
      account.isVerified = true;
      await account.save();
    }

    const token = createToken(account._id);
    res.cookie("token", token, {
      httpOnly: true,
      secure: false,
      sameSite: "lax",
      maxAge: 7 * 24 * 60 * 60 * 1000,
    });

    const passkeyCount = Array.isArray(account.passkeys) ? account.passkeys.length : 0;
    return res.status(200).json({
      success: true,
      msg: "Login successful",
      passkeyConfigured: passkeyCount > 0,
    });
  } catch (error) {
    console.error("Login Error:", error);
    return res.status(500).json({
      success: false,
      msg: "Error in login",
    });
  }
};

export const submitRepairerVerification = async (req, res) => {
  try {
    const account = await Accounts.findById(req.accountId).select("role isVerified");
    if (!account) {
      return res.status(404).json({
        success: false,
        msg: "Account not found",
      });
    }

    if (account.role !== "repairer") {
      return res.status(403).json({
        success: false,
        msg: "Only repairer accounts can submit verification",
      });
    }

    if (!account.isVerified) {
      account.isVerified = true;
      await account.save();
    }

    const existingProfile = await RepairerSchema.findOne({ accountId: req.accountId });
    const uploadShopImage = getUploadedFile(req, "shopImage");
    const uploadedShopImage = await uploadImageToCloudinary(
      uploadShopImage,
      "fixora/repairer-shops"
    );

    const normalizedProfile = await normalizeRepairerProfilePayload({
      ...req.body,
      shopImage: uploadedShopImage || existingProfile?.shopImage,
    });

    const idDocumentImageFile = getUploadedFile(req, "idDocumentImage");
    const selfieImageFile = getUploadedFile(req, "selfieImage");
    const skillProofImageFile = getUploadedFile(req, "skillProofImage");

    const [uploadedIdDocumentImage, uploadedSelfieImage, uploadedSkillProofImage] =
      await Promise.all([
        uploadImageToCloudinary(idDocumentImageFile, "fixora/repairer-verification/id-document"),
        uploadImageToCloudinary(selfieImageFile, "fixora/repairer-verification/selfie"),
        uploadImageToCloudinary(skillProofImageFile, "fixora/repairer-verification/skill-proof"),
      ]);

    const declarationCode = String(req.body?.declarationCode || "").trim().toUpperCase();
    if (!declarationCode) {
      throw new Error("Selfie declaration code is required");
    }

    const verificationData = {
      idDocumentImage:
        uploadedIdDocumentImage || String(existingProfile?.verification?.idDocumentImage || ""),
      selfieImage: uploadedSelfieImage || String(existingProfile?.verification?.selfieImage || ""),
      skillProofImage:
        uploadedSkillProofImage || String(existingProfile?.verification?.skillProofImage || ""),
      declarationCode,
      reviewNotes: "",
      submittedAt: new Date(),
      reviewedAt: null,
    };

    if (!verificationData.idDocumentImage) {
      throw new Error("Identity document image is required");
    }
    if (!verificationData.selfieImage) {
      throw new Error("Selfie image is required");
    }
    if (!verificationData.skillProofImage) {
      throw new Error("Skill proof image is required");
    }

    const profileData = {
      ...normalizedProfile,
      accountId: req.accountId,
      isPhoneVerified: false,
      status: "pending",
      verification: verificationData,
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

    return res.status(200).json({
      success: true,
      msg: "Verification submitted successfully. Your profile is pending admin review.",
      repairerProfile,
    });
  } catch (error) {
    console.error("Repairer verification submit error:", error);
    const statusCode = PROFILE_VALIDATION_ERRORS.includes(error.message) ? 400 : 500;
    return res.status(statusCode).json({
      success: false,
      msg: error.message || "Unable to submit verification",
    });
  }
};

export const reviewRepairerVerification = async (req, res) => {
  try {
    if (!ensureAdminReviewAccess(req, res)) {
      return;
    }

    const accountId = String(req.body?.accountId || "").trim();
    const decision = String(req.body?.status || "").trim().toLowerCase();
    const reviewNotes = String(req.body?.reviewNotes || "").trim();

    if (!accountId || !mongoose.Types.ObjectId.isValid(accountId)) {
      return res.status(400).json({
        success: false,
        msg: "Valid repairer accountId is required",
      });
    }

    if (decision !== "approved" && decision !== "rejected") {
      return res.status(400).json({
        success: false,
        msg: "Status must be approved or rejected",
      });
    }

    const repairerProfile = await RepairerSchema.findOne({ accountId });
    if (!repairerProfile) {
      return res.status(404).json({
        success: false,
        msg: "Repairer profile not found",
      });
    }

    repairerProfile.status = decision;
    repairerProfile.isPhoneVerified = decision === "approved";
    repairerProfile.verification = {
      ...(repairerProfile.verification || {}),
      reviewNotes,
      reviewedAt: new Date(),
    };
    await repairerProfile.save();

    const verificationState = getRepairerVerificationState(repairerProfile);
    return res.status(200).json({
      success: true,
      msg:
        decision === "approved"
          ? "Repairer approved successfully"
          : "Repairer rejected successfully",
      repairerProfile,
      canApproachCustomers: verificationState.canApproachCustomers,
    });
  } catch (error) {
    console.error("Repairer review error:", error);
    return res.status(500).json({
      success: false,
      msg: "Unable to review repairer verification",
    });
  }
};

export const getRepairerVerificationsForReview = async (req, res) => {
  try {
    if (!ensureAdminReviewAccess(req, res)) {
      return;
    }

    const requestedStatus = String(req.query?.status || "pending")
      .trim()
      .toLowerCase();
    const allowedStatuses = new Set([
      "pending",
      "approved",
      "rejected",
      "incomplete",
      "all",
    ]);

    if (!allowedStatuses.has(requestedStatus)) {
      return res.status(400).json({
        success: false,
        msg: "Invalid status filter",
      });
    }

    const filter = requestedStatus === "all" ? {} : { status: requestedStatus };
    const repairers = await RepairerSchema.find(filter)
      .sort({ updatedAt: -1 })
      .select(
        "accountId username personalPhone shopName experience skills address city pincode shopPhone availability status verification createdAt updatedAt"
      )
      .lean();

    const accountIds = repairers
      .map((repairerItem) => repairerItem?.accountId)
      .filter((accountId) => mongoose.Types.ObjectId.isValid(accountId))
      .map((accountId) => new mongoose.Types.ObjectId(accountId));

    const accounts = await Accounts.find({ _id: { $in: accountIds } })
      .select("_id email")
      .lean();
    const accountEmailMap = new Map(
      accounts.map((accountItem) => [String(accountItem._id), String(accountItem.email || "")])
    );

    const reviewItems = repairers.map((repairerItem) => ({
      ...repairerItem,
      accountId: String(repairerItem.accountId || ""),
      email: accountEmailMap.get(String(repairerItem.accountId || "")) || "",
    }));

    return res.status(200).json({
      success: true,
      status: requestedStatus,
      total: reviewItems.length,
      repairers: reviewItems,
    });
  } catch (error) {
    console.error("Repairer review list error:", error);
    return res.status(500).json({
      success: false,
      msg: "Unable to fetch repairer verification list",
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
    if (!existingProfile) {
      return res.status(400).json({
        success: false,
        msg: "Submit your repairer verification profile first",
      });
    }

    if (String(existingProfile.status || "").toLowerCase() !== "approved") {
      throw new Error("Only approved repairers can update profile details");
    }

    const uploadedShopImage = await uploadImageToCloudinary(req.file, "fixora/repairer-shops");
    const normalizedProfile = await normalizeRepairerProfilePayload({
      ...req.body,
      shopImage: uploadedShopImage || existingProfile.shopImage,
    });
    const updatedProfileData = {
      ...normalizedProfile,
      accountId: req.accountId,
      isPhoneVerified: true,
      status: "approved",
      verification: existingProfile.verification || {},
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
      status: "approved",
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

    const repairers = await RepairerSchema.find({ isPhoneVerified: true, status: "approved" })
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
      status: "approved",
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
