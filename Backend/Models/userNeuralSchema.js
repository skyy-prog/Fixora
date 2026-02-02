import mongoose from "mongoose";


const UserNeuralSchema = new mongoose.Schema({
    name:{type:String , required:true},
    email:{type:String , required:true , unique:true},
    password:{type:String , required:true},
},{minimize:false});


const usermodel = mongoose.models.user|| mongoose.model('user',UserNeuralSchema);

export default usermodel;