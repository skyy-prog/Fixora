import mongoose from "mongoose";

const PasskeySchema = new mongoose.Schema(
  {
    credentialID: {
      type: String,
      required: true,
    },
    credentialPublicKey: {
      type: String,
      required: true,
    },
    counter: {
      type: Number,
      default: 0,
    },
    transports: {
      type: [String],
      default: [],
    },
    deviceType: {
      type: String,
      default: "singleDevice",
    },
    backedUp: {
      type: Boolean,
      default: false,
    },
    rpID: {
      type: String,
      default: "",
    },
    origin: {
      type: String,
      default: "",
    },
  },
  { _id: false }
);

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

  passkeys: {
    type: [PasskeySchema],
    default: [],
  },
  passkeyChallenge: {
    type: String,
    default: null,
  },
  passkeyChallengeRpID: {
    type: String,
    default: "",
  },
  passkeyChallengeOrigin: {
    type: String,
    default: "",
  },

  role : String,
  preferredLanguage: {
    type: String,
    default: "en"
  }

}, { timestamps: true });

export default mongoose.model("Account", AccountSchema);
