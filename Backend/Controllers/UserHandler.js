import usermodel from "../Models/userNeuralSchema.js";
import validator from "validator";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import { sendOTP } from "../Utils/Mailer.js";
  const createToken = (id) => {
  return jwt.sign(
    { id },
    process.env.JWT_SECRET,
    { expiresIn: "7d" }    
  );
};
 export const UserSignIn = async(req,res)=>{
   try {
      const {email , password} = req.body;
    if(!email || !password){
        return res.json({success : false , msg : 'ALL fields are required'});
    }
    const Requisteduser = await usermodel.findOne({email});
    if(!Requisteduser){
        return res.json({success : false , msg : 'User doenst Exits Please Register First.'}); 
    }
    const Ismatch = await bcrypt.compare(password , Requisteduser.password);

    if(!Ismatch){
         return res.json({success : false , msg : 'Invalid Crendentials'}); 
    }
    const token = createToken(Requisteduser._id);

// const isProd = process.env.NODE_ENV === "production";
console.log(process.env.NODE_ENV)
res.cookie("token", token, {
  httpOnly: true,
  secure: false,
  sameSite: "lax",
  maxAge: 7 * 24 * 60 * 60 * 1000,
});

 res.status(200).json({
    success:true,
    msg: "Login successful",
    user: { id: Requisteduser._id, email: Requisteduser.email ,  isVerified : Requisteduser.isVerified }
  });

   } catch (error) {
    res.json({success:false , msg:'Something Went Wrong please try again later'})
   }

}


export const veryfiyingtheotptrhoughregistration = async (req, res) => {
  const { email, otp } = req.body;

  const user = await usermodel.findOne({ email });

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
    const { username, password, email } = req.body;

    if (!username || !password || !email){
      return res.json({ success: false, msg: "Fill all the Fields" });
    }

    if (!validator.isEmail(email)) {
      return res.json({ success: false, msg: "Enter valid email" });
    }
    const exists = await usermodel.findOne({ email });
    if (exists) { 
      return res.json({ success: false, msg: "Already have account" });
    }
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);
    const otp = await sendOTP({ email });
    await usermodel.create({
      username,
      email,
      password: hashedPassword,
      otp: otp,
      otpExpire: Date.now() + 5 * 60 * 1000,
      isVerified: false,
    });

    return res.json({ success: true, msg: "OTP Sent to Email" });

  } catch (err) {
    console.log(err);
    res.json({ success: false, msg: "Server Error" });
  }
};