import express from 'express';
import authController from '../controllers/auth.controller.js';
import { ValidateJoi, validateSchema } from '../middleware/joi.middleware.js';

const router = express.Router();

router.post(
  '/signup',
  ValidateJoi(validateSchema.user.signUp),
  authController.signUp
);

router.post(
  '/signin',
  ValidateJoi(validateSchema.user.signIn),
  authController.signIn
);

router.get('/refreshToken', authController.refreshToken);

router.delete('/signout', authController.signOut);

export default router;
