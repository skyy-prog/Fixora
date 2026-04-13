// import { Router } from "express";
import express from 'express';
import { UserRegister, UserSignIn, veryfiyingtheotptrhroughregistration , Singout } from '../Controllers/UserHandler.js';
import { AuthMiddleware } from '../MiddleWare/AuthMiddleware.js';
import { Getme } from '../Controllers/GetMe.js';
const UseRouter = express.Router();
UseRouter.post('/Login' ,UserSignIn );
UseRouter.post('/register' , UserRegister);
UseRouter.post('/otpverify' , veryfiyingtheotptrhroughregistration);
UseRouter.post('/logout' , Singout);
UseRouter.get('/me' , AuthMiddleware , Getme)
export default UseRouter;
