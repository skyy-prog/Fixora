import usermodel from "../Models/userNeuralSchema.js";
import AccountNeuralschema from "../Models/AccountNeuralschema.js";
import RepairerSchema from "../Models/RepairerNeuralSchema.js";
import { getTokenClearCookieOptions } from "../Utils/cookieOptions.js";

export const Getme = async (req, res) => {
  try {
    const account = await AccountNeuralschema.findById(req.accountId).select(
      "-password -otp -otpExpire -passkeyChallenge -__v"
    );

    if (!account) {
      res.clearCookie("token", getTokenClearCookieOptions());
      return res.status(401).json({
        success: false,
        msg: "Account not found"
      });
    }

    let profileData = null;

    if (account.role === "repairer") {
      profileData = await RepairerSchema.findOne({ accountId: req.accountId }).select("-__v");
    } else {
      profileData = await usermodel.findOne({ accountId: req.accountId }).select("-__v");
    }

    const fallbackProfile = {
      accountId: req.accountId,
      username: account.email?.split("@")?.[0] || "User",
      PostData: [],
    };

    const hasRepairerProfile = account.role === "repairer" && Boolean(profileData);
    const repairerVerificationStatus =
      account.role === "repairer" ? String(profileData?.status || "incomplete") : null;
    const isRepairerPhoneVerified =
      account.role === "repairer"
        ? Boolean(profileData?.isPhoneVerified) &&
          String(profileData?.status || "").toLowerCase() === "approved"
        : false;
    const passkeyCount = Array.isArray(account?.passkeys) ? account.passkeys.length : 0;

    return res.json({
      success: true,
      user: profileData || fallbackProfile,
      accountId: req.accountId,
      Isverified: account.isVerified,
      email: account.email,
      role: account.role,
      preferredLanguage: account.preferredLanguage || "en",
      repairerProfileCreated: hasRepairerProfile,
      repairerPhoneVerified: isRepairerPhoneVerified,
      repairerVerificationStatus,
      repairerPasskeyConfigured: passkeyCount > 0,
      canApproachCustomers:
        account.role === "repairer"
          ? isRepairerPhoneVerified && repairerVerificationStatus === "approved"
          : account.isVerified,
    });
  } catch (error) {
    console.log(error);

    res.clearCookie("token", getTokenClearCookieOptions());

    return res.status(500).json({
      success: false,
      msg: "internal error",
      msg2: error.message
    });
  }
};
