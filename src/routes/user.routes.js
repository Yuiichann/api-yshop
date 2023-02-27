import express from 'express';
import userController from '../controllers/user.controllers.js';
import { verifyToken } from '../middleware/verifyToken.middleware.js';
import upload from '../configs/multer.configs.js';
import { ValidateJoi, validateSchema } from '../middleware/joi.middleware.js';

const router = express.Router();

router.get('/info', verifyToken, userController.getInfoUser);

router.put(
  '/set-avatar',
  verifyToken,
  upload.single('avatar'),
  userController.setAvatar
);

router.put(
  '/update-password',
  verifyToken,
  ValidateJoi(validateSchema.user.updatePassword),
  userController.updatePassword
);

export default router;
