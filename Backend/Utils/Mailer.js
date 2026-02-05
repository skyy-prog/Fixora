import nodemailer from "nodemailer";
import otpGenerator from "otp-generator";

export const sendOTP = async ({ email }) => {
  try {

    const Mailtransporter = nodemailer.createTransport({
      service: "gmail",
      auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS
      }
    });

    const otp = otpGenerator.generate(6, {
      lowerCaseAlphabets: false,
      upperCaseAlphabets: false,
      specialChars: false,
    });

    await Mailtransporter.sendMail({
      from: process.env.EMAIL_USER,
      to: email,
      subject: "Your OTP Code",
      text: `Your OTP is ${otp}`
    });

    console.log("Mail Sent Successfully");

    return otp;

  } catch (error) {
    console.log("MAIL ERROR:", error);
    return null;
  }
};
