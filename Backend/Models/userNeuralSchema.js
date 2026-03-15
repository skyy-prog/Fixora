import mongoose from "mongoose";

const UserSchema = new mongoose.Schema({
  accountId: { 
    type: mongoose.Schema.Types.ObjectId, 
    ref: "Account",
    required: true 
  },
  username: String,
  address: String,   
location: { 
  latitude: Number,
  longitude: Number
},
PostData: {type : [Object] , default  : []},
});

export default mongoose.model("User", UserSchema);