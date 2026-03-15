import usermodel from "../Models/userNeuralSchema.js";
import AccountNeuralschema from "../Models/AccountNeuralschema.js";
export const Getme = async (req, res) => {
  try {
    const user = await usermodel
      .findOne({ accountId: req.accountId })
      .select("-__v");
      const Isverified =  await AccountNeuralschema.findById(req.accountId);
       
    if (!user) {
      res.clearCookie("token");
      return res.status(401).json({
        success: false,
        msg: "User not found"
      });
    }
    return res.json({
      success: true,
      user,
    Isverified  : Isverified.isVerified,
    email : Isverified.email,
    role : Isverified.role
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