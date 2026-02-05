import mongoose from "mongoose";

const ConnectDB = async()=>{
    mongoose.connection.on('connected', ()=>{
        console.log('connected to the database')
    })
    await mongoose.connect(`${process.env.MONGO_URI}/Fixora`);
};

export default ConnectDB;