import express from "express";
import mongoose from "mongoose";
import cors from "cors";
import dotenv from "dotenv";
import ConnectDB from "./Config/MongoDB.js";
import cookieParser from "cookie-parser";
import UseRouter from "./Routes/UserRoutes.js";

dotenv.config();
const app = express();
ConnectDB()
app.use(cors());
app.use(express.json());
app.use(cookieParser());
app.use('/api/user' , UseRouter);
// console.log(process.env.MONGO_URI)
app.listen(5000, ()=> console.log("Server running on 5000"));
