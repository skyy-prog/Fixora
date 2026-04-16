import Accounts from "../Models/AccountNeuralschema.js";
import {sendOTP} from "../Utils/Mailer.js";
import jwt from "jsonwebtoken";
import validator from "validator";
import bcrypt from "bcrypt";

const createToken = (id)=>{
    return jwt.sign({id} , process.env.JWT_SECRET , {expiresIn : "7d"});
}
export const registerRepairer = async (req, res) => {
  try {
    let {   email, password } = req.body;

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
       const { email, password } = req.body;
    if (!email || !password) {
        return res.status(400).json({
            success: false,
            msg: "Email and password are required"
        });
    }
    const account = await Accounts.findOne({email});
    if (!account) {
        return res.status(404).json({
            success: false,
            msg: "Repairer account not found"
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