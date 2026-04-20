import twilio from "twilio";

const getE164Number = (rawPhone) => {
  const trimmed = String(rawPhone || "").trim();

  if (trimmed.startsWith("+")) {
    return trimmed;
  }

  const digitsOnly = trimmed.replace(/\D/g, "");

  if (digitsOnly.length === 10) {
    return `+91${digitsOnly}`;
  }

  if (digitsOnly.length >= 11 && digitsOnly.length <= 15) {
    return `+${digitsOnly}`;
  }

  throw new Error("Invalid phone format for SMS delivery");
};

const getTrimmedEnv = (name) => String(process.env[name] || "").trim();

export const sendPhoneOTP = async ({ phone, otp }) => {
  const accountSid = getTrimmedEnv("TWILIO_ACCOUNT_SID");
  const authToken = getTrimmedEnv("TWILIO_AUTH_TOKEN");
  const fromNumber = getTrimmedEnv("TWILIO_PHONE_NUMBER");
  const messagingServiceSid = getTrimmedEnv("TWILIO_MESSAGING_SERVICE_SID");

  if (!accountSid || !authToken) {
    throw new Error("Missing Twilio credentials in environment");
  }

  if (accountSid.startsWith("VA")) {
    throw new Error(
      "TWILIO_ACCOUNT_SID must be your Account SID (starts with AC), not a Verify Service SID (starts with VA)"
    );
  }

  if (!accountSid.startsWith("AC")) {
    throw new Error("TWILIO_ACCOUNT_SID is invalid. It must start with AC");
  }

  if (!fromNumber && !messagingServiceSid) {
    throw new Error(
      "Missing Twilio sender configuration: set TWILIO_PHONE_NUMBER or TWILIO_MESSAGING_SERVICE_SID"
    );
  }

  const client = twilio(accountSid, authToken);
  const toNumber = getE164Number(phone);
  const messagePayload = {
    body: `Your Fixora mobile verification OTP is ${otp}. It expires in 5 minutes.`,
    to: toNumber,
  };

  if (messagingServiceSid) {
    messagePayload.messagingServiceSid = messagingServiceSid;
  } else {
    messagePayload.from = getE164Number(fromNumber);
  }

  await client.messages.create(messagePayload);
};
