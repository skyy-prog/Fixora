import express from 'express';
import { HandleProblems } from '../Controllers/ProblemsHandler.js';
import upload from '../MiddleWare/Multer.js';
 
 export const ProductRouter = express.Router();
ProductRouter.post('/post' , upload.fields([{ name : 'image1' , maxCount : 1} , {name : 'image2' , maxCount:1} , { name : 'image3' , maxCount:1}]), HandleProblems);