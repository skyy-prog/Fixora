// import { Router } from "express";
import express from 'express';
import { UserSignIn } from '../Controllers/UserHandler';
const UseRouter = express.Router();
UseRouter.post('/Login' ,UserSignIn );
export default UseRouter;
