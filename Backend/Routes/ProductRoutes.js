import express from 'express';
import {
  HandleProblems,
  analyzeProblem,
  getAllPostedProblems,
  createRepairRequest,
  updateUserProblem,
  deleteUserProblem
} from '../Controllers/ProblemsHandler.js';
import upload from '../MiddleWare/Multer.js';
import { AuthMiddleware } from '../MiddleWare/AuthMiddleware.js';

export const ProductRouter = express.Router();

// ✅ EXISTING ROUTE
ProductRouter.post(
  '/post',
  AuthMiddleware,
  upload.fields([
    { name: 'image1', maxCount: 1 },
    { name: 'image2', maxCount: 1 },
    { name: 'image3', maxCount: 1 }
  ]),
  HandleProblems
);
ProductRouter.post(
  '/analyze',
  AuthMiddleware,
  upload.fields([
    { name: 'image1', maxCount: 1 },
    { name: 'image2', maxCount: 1 },
    { name: 'image3', maxCount: 1 }
  ]),
  analyzeProblem
);

ProductRouter.get('/all-problems', AuthMiddleware, getAllPostedProblems);
ProductRouter.post('/problems/:problemId/request', AuthMiddleware, createRepairRequest);
ProductRouter.patch('/problems/:problemId', AuthMiddleware, updateUserProblem);
ProductRouter.delete('/problems/:problemId', AuthMiddleware, deleteUserProblem);
