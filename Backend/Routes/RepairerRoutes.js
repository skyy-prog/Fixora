import express from "express";
import {registerRepairer , verifyOTP  , repairerLogin}from "../Controllers/RepairerHandler.js";
const RepairerRouter = express.Router();
RepairerRouter.post("/register", registerRepairer);
RepairerRouter.post("/verifyRepairer-otp", verifyOTP);
RepairerRouter.post("/repairerlogin", repairerLogin);
export default RepairerRouter;  