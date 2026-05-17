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

const parseAllowedOrigins = (value) =>
  String(value || "")
    .split(",")
    .map((origin) => origin.trim().replace(/\/+$/, ""))
    .filter(Boolean);

const allowedOrigins = [
  ...new Set([
    "http://localhost:5173",
    "http://localhost:5174",
    "https://fixora.anantbuilds.me",
    "https://www.fixora.anantbuilds.me",
    ...parseAllowedOrigins(process.env.CORS_ORIGINS),
    ...parseAllowedOrigins(process.env.FRONTEND_URL),
  ]),
];

const isAllowedOrigin = (origin) => {
  if (!origin) {
    return true;
  }
  return allowedOrigins.includes(String(origin).replace(/\/+$/, ""));
};

const corsOptions = {
  origin: (origin, callback) => {
    if (isAllowedOrigin(origin)) {
      callback(null, true);
      return;
    }
    console.warn(`Blocked by CORS: ${origin}`);
    callback(new Error(`CORS origin is not allowed: ${origin}`));
  },
  credentials: true,
};

const app = express();
const requestedPort = Number(process.env.PORT || process.env.port || 5000);
const initialPort = Number.isFinite(requestedPort) && requestedPort > 0 ? requestedPort : 5000;
const server = http.createServer(app);
ConnectDB()
app.use(cors(corsOptions));
ConnectClodinary();
app.use(express.json());
app.use(cookieParser());

const healthHandler = (req, res) => {
  res.status(200).json({
    success: true,
    status: "ok",
    service: "fixora-backend",
    uptime: process.uptime(),
    timestamp: new Date().toISOString(),
  });
};

app.get("/health", healthHandler);
app.get("/api/health", healthHandler);

app.use('/api/user' , UseRouter);
app.use('/api/product' , ProductRouter);
app.use('/api/repairer' , RepairerRouter);
app.use('/api/chat', ChatRouter);

const io = new Server(server, {
  cors: {
    origin: (origin, callback) => {
      if (isAllowedOrigin(origin)) {
        callback(null, true);
        return;
      }
      console.warn(`Blocked socket by CORS: ${origin}`);
      callback(new Error(`Socket CORS origin is not allowed: ${origin}`));
    },
    credentials: true,
  },
});

app.set("io", io);
registerChatSocketHandlers(io);

server.on("error", (error) => {
  if (error?.code === "EADDRINUSE") {
    console.error(`Port ${initialPort} is already in use. Stop the existing process and restart.`);
    process.exit(1);
  }
  throw error;
});

server.listen(initialPort, () => {
  console.log(`Server running on ${initialPort}`);
});
