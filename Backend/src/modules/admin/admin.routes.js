import { Router } from 'express';
import { authenticate, isAdmin } from '../auth/auth.middleware.js';
import {
  getDashboardStats,
  adminGetAllOrders,
  adminGetOrderById,
  adminUpdateOrderStatus,
} from './admin.controller.js';

const router = Router();

router.get('/stats', authenticate, isAdmin, getDashboardStats);
router.get('/orders', authenticate, isAdmin, adminGetAllOrders);
router.get('/orders/:id', authenticate, isAdmin, adminGetOrderById);
router.patch('/orders/:id/status', authenticate, isAdmin, adminUpdateOrderStatus);

export default router;
