import express from 'express';
import userController from '../controllers/user.controllers.js';
import { verifyToken } from '../middleware/verifyToken.middleware.js';

const router = express.Router();

router.get('/info', verifyToken, userController.getInfoUser);

export default router;
