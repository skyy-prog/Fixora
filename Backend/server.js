import dotenv from "dotenv";
dotenv.config();
import express from "express";
import mongoose from "mongoose";
import cors from "cors";
import ConnectDB from "./Config/MongoDB.js";
import cookieParser from "cookie-parser";
import UseRouter from "./Routes/UserRoutes.js";
import { ConnectClodinary } from "./Config/ClodinaryConfig.js";
import { ProductRouter } from "./Routes/ProductRoutes.js";
const app = express();
const port = process.env.port || 5000
ConnectDB()
app.use(cors({
    origin: "http://localhost:5173",
  credentials: true
}));
ConnectClodinary();
app.use(express.json());
app.use(cookieParser());
app.use('/api/user' , UseRouter);
app.use('/api/product' , ProductRouter)

app.listen(port, ()=> console.log("Server running on 5000"));
