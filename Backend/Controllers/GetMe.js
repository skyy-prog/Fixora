import usermodel from "../Models/userNeuralSchema.js";
import AccountNeuralschema from "../Models/AccountNeuralschema.js";
import RepairerSchema from "../Models/RepairerNeuralSchema.js";

export const Getme = async (req, res) => {
  try {
    const account = await AccountNeuralschema.findById(req.accountId).select("-password -otp -otpExpire -__v");

    if (!account) {
      res.clearCookie("token");
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
    const isRepairerPhoneVerified =
      account.role === "repairer" ? Boolean(profileData?.isPhoneVerified) : false;

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
      canApproachCustomers:
        account.role === "repairer" ? isRepairerPhoneVerified : account.isVerified,
    });
  } catch (error) {
    console.log(error);

    res.clearCookie("token");

    return res.status(500).json({
      success: false,
      msg: "internal error",
      msg2: error.message
    });
  }
};
