import usermodel from "../Models/userNeuralSchema.js"; 

export const Getme = async (req, res) => {
  try {
    const user = await usermodel
      .findById(req.userId)
      .select('-password -otp -otpExpire -__v');

    if (!user) {
      res.clearCookie('token');
      return res.status(401).json({
        success: false,
        msg: 'User not found'
      });
    }

    return res.json({
      success: true,
      user
    });

  } catch (error) {
    res.clearCookie('token'); 
    return res.status(500).json({
      success: false,
      msg: 'internal error'
    });
  }
};
