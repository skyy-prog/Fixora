// import { Router } from "express";
import express from 'express';
import { UserRegister, UserSignIn, veryfiyingtheotptrhoughregistration } from '../Controllers/UserHandler.js';
const UseRouter = express.Router();
UseRouter.post('/Login' ,UserSignIn );
UseRouter.post('/register' , UserRegister);
UseRouter.post('/otpverify' , veryfiyingtheotptrhoughregistration);
export default UseRouter;
