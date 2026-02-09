// import { Router } from "express";
import express from 'express';
import { UserRegister, UserSignIn, veryfiyingtheotptrhoughregistration } from '../Controllers/UserHandler.js';
import { AuthMiddleware } from '../MiddleWare/AuthMiddleware.js';
import { Getme } from '../Controllers/GetMe.js';
const UseRouter = express.Router();
UseRouter.post('/Login' ,UserSignIn );
UseRouter.post('/register' , UserRegister);
UseRouter.post('/otpverify' , veryfiyingtheotptrhoughregistration);
UseRouter.get('/me' , AuthMiddleware , Getme)
export default UseRouter;
