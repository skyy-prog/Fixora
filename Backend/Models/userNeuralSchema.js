import mongoose from "mongoose";


// const UserNeuralSchema = new mongoose.Schema({
//     name:{type:String , required:true},
//     email:{type:String , required:true , unique:true},
//     password:{type:String , required:true},
// },{minimize:false});


// const usermodel = mongoose.models.user|| mongoose.model('user',UserNeuralSchema);

// export default usermodel;



// import mongoose from "mongoose";

const UserNeuralSchema = new mongoose.Schema({
  username: String,
  email: String,
  password: String,
  otp: String,
  otpExpire: Date,
  isVerified: {
    type: Boolean,
    default: false
  }
});

export default mongoose.model("user", UserNeuralSchema);
