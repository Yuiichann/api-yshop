import express from 'express';
import orderControllers from '../controllers/order.controllers.js';
import {
  verifyToken,
  verifyTokenAdmin,
} from '../middleware/verifyToken.middleware.js';
import { validateSchema, ValidateJoi } from '../middleware/joi.middleware.js';

const router = express.Router();

// route admin
router.get('/by-admin', verifyTokenAdmin, orderControllers.getOrdersByAdmin);

router.get(
  '/by-admin/:orderId',
  verifyTokenAdmin,
  orderControllers.getOrderDetailByAdmin
);

// route user
router.post(
  '/create',
  verifyToken,
  ValidateJoi(validateSchema.order.create),
  orderControllers.createOrder
);

router.get('/of-user', verifyToken, orderControllers.getOrdersOfUser);

router.get(
  '/of-user/:orderId',
  verifyToken,
  orderControllers.getOrderDetailByUser
);

export default router;
