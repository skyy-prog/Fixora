import dotenv from "dotenv";
dotenv.config();
import express from "express";
import http from "http";
import cors from "cors";
import ConnectDB from "./Config/MongoDB.js";
import cookieParser from "cookie-parser";
import { Server } from "socket.io";
import UseRouter from "./Routes/UserRoutes.js";
import RepairerRouter from "./Routes/RepairerRoutes.js";
import { ConnectClodinary } from "./Config/ClodinaryConfig.js";
import { ProductRouter } from "./Routes/ProductRoutes.js";
import ChatRouter from "./Routes/ChatRoutes.js";
import { registerChatSocketHandlers } from "./Sockets/ChatSocket.js";
const app = express();
const port = process.env.port || 5000
const server = http.createServer(app);
ConnectDB()
app.use(cors({
    origin: "http://localhost:5173",
  credentials: true
}));
ConnectClodinary();
app.use(express.json());
app.use(cookieParser());
app.use('/api/user' , UseRouter);
app.use('/api/product' , ProductRouter);
app.use('/api/repairer' , RepairerRouter);
app.use('/api/chat', ChatRouter);

const io = new Server(server, {
  cors: {
    origin: "http://localhost:5173",
    credentials: true,
  },
});

app.set("io", io);
registerChatSocketHandlers(io);

server.listen(port, ()=> console.log("Server running on 5000"));
