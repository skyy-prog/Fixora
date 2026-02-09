import usermodel from "../Models/userNeuralSchema.js"; 
export const Getme = async(req,res)=>{
    try {
        const user = await usermodel.findById(req.userId).select('-password -otp -otpExpire -__v');
        if(!user) return res.json({ success:false , msg:'User not found' });
        res.json({success: true , user})
    } catch (error) {
        res.json({success: false , msg:'internal error'})
    }
}