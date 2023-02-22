import express from 'express';
import userController from '../controllers/user.controllers.js';
import { verifyToken } from '../middleware/verifyToken.middleware.js';
import upload from '../configs/multer.configs.js';

const router = express.Router();

router.get('/info', verifyToken, userController.getInfoUser);

router.put(
  '/set-avatar',
  verifyToken,
  upload.single('avatar'),
  userController.setAvatar
);

export default router;
