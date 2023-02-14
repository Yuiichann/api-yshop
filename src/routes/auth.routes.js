import express from 'express';
import authController from '../controllers/auth.controllers.js';
import limiterLogin from '../middleware/limiterLogin.middlewares.js';
import { ValidateJoi, validateSchema } from '../middleware/joi.middleware.js';

const router = express.Router();

router.post(
  '/signup',
  ValidateJoi(validateSchema.user.signUp),
  authController.signUp
);

router.post(
  '/signin',
  limiterLogin,
  ValidateJoi(validateSchema.user.signIn),
  authController.signIn
);

router.post('/refreshToken', authController.refreshToken);

router.delete('/signout', authController.signOut);

export default router;
