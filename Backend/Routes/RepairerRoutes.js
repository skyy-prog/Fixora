import express from "express";
import {
  registerRepairer,
  repairerLogin,
  submitRepairerVerification,
  updateRepairerProfile,
  getPublicRepairers,
  getPublicRepairerById,
  submitRepairerReview,
  startRepairerPasskeyRegistration,
  finishRepairerPasskeyRegistration,
  startRepairerPasskeyLogin,
  finishRepairerPasskeyLogin,
  reviewRepairerVerification,
  getRepairerVerificationsForReview,
} from "../Controllers/RepairerHandler.js";
import { AuthMiddleware, OptionalAuthMiddleware } from "../MiddleWare/AuthMiddleware.js";
import upload from "../MiddleWare/Multer.js";
const RepairerRouter = express.Router();

const repairerVerificationUpload = upload.fields([
  { name: "shopImage", maxCount: 1 },
  { name: "idDocumentImage", maxCount: 1 },
  { name: "selfieImage", maxCount: 1 },
  { name: "skillProofImage", maxCount: 1 },
]);

RepairerRouter.post("/register", registerRepairer);
RepairerRouter.post("/repairerlogin", repairerLogin);
RepairerRouter.post("/passkey/register/options", AuthMiddleware, startRepairerPasskeyRegistration);
RepairerRouter.post("/passkey/register/verify", AuthMiddleware, finishRepairerPasskeyRegistration);
RepairerRouter.post("/passkey/login/options", startRepairerPasskeyLogin);
RepairerRouter.post("/passkey/login/verify", finishRepairerPasskeyLogin);
RepairerRouter.post("/profile/submit", AuthMiddleware, repairerVerificationUpload, submitRepairerVerification);
RepairerRouter.put("/profile", AuthMiddleware, upload.single("shopImage"), updateRepairerProfile);
RepairerRouter.get("/profile/review", getRepairerVerificationsForReview);
RepairerRouter.patch("/profile/review", reviewRepairerVerification);
RepairerRouter.get("/public", OptionalAuthMiddleware, getPublicRepairers);
RepairerRouter.get("/public/:id", OptionalAuthMiddleware, getPublicRepairerById);
RepairerRouter.post("/public/:id/reviews", AuthMiddleware, submitRepairerReview);
export default RepairerRouter;  
