import dotenv from "dotenv";
dotenv.config();
import express from "express";
import mongoose from "mongoose";
import cors from "cors";
import ConnectDB from "./Config/MongoDB.js";
import cookieParser from "cookie-parser";
import UseRouter from "./Routes/UserRoutes.js";
const app = express();
const port = process.env.port || 5000
ConnectDB()
app.use(cors({
    origin: "http://localhost:5173",
  credentials: true
}));
app.use(express.json());
app.use(cookieParser());
app.use('/api/user' , UseRouter);
console.log("USER:", process.env.EMAIL_USER);
console.log("PASS:", process.env.EMAIL_PASS);

// console.log(process.env.MONGO_URI)
app.listen(port, ()=> console.log("Server running on 5000"));
