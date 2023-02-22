import express from 'express';
import authRoutes from './auth.routes.js';
import figureRoutes from './figure.routes.js';
import userRoutes from './user.routes.js';
import orderRoutes from './order.routes.js';
import figureControllers from '../controllers/figure.controllers.js';

const router = express.Router();

router.use('/auth', authRoutes);

router.use('/users', userRoutes);

router.use('/figures', figureRoutes);

router.use('/orders', orderRoutes);

// router get home
router.get('/home-page', figureControllers.getHomePage);

export default router;
