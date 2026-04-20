import express from "express";
import {
  registerRepairer,
  verifyOTP,
  repairerLogin,
  sendRepairerPhoneOTP,
  verifyRepairerPhoneOTP,
  updateRepairerProfile,
  getPublicRepairers,
  getPublicRepairerById,
} from "../Controllers/RepairerHandler.js";
import { AuthMiddleware, OptionalAuthMiddleware } from "../MiddleWare/AuthMiddleware.js";
import upload from "../MiddleWare/Multer.js";
const RepairerRouter = express.Router();
RepairerRouter.post("/register", registerRepairer);
RepairerRouter.post("/verifyRepairer-otp", verifyOTP);
RepairerRouter.post("/repairerlogin", repairerLogin);
RepairerRouter.post("/profile/send-phone-otp", AuthMiddleware, upload.single("shopImage"), sendRepairerPhoneOTP);
RepairerRouter.post("/profile/verify-phone-otp", AuthMiddleware, verifyRepairerPhoneOTP);
RepairerRouter.put("/profile", AuthMiddleware, upload.single("shopImage"), updateRepairerProfile);
RepairerRouter.get("/public", OptionalAuthMiddleware, getPublicRepairers);
RepairerRouter.get("/public/:id", OptionalAuthMiddleware, getPublicRepairerById);
export default RepairerRouter;  
