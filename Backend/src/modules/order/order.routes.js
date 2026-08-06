import { Router } from 'express';
import { authenticate } from '../user/user.middleware.js';
import { getAllOrders, getOrderById } from './order.controller.js';

const router = Router();

/**
 * @openapi
 * /api/v1/orders/all:
 *   get:
 *     summary: List all Orders for the authenticated user
 *     tags: [Orders]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Order list
 */
router.get('/all', authenticate, getAllOrders);

/**
 * @openapi
 * /api/v1/orders/{id}:
 *   get:
 *     summary: Get a single order owned by the authenticated user
 *     tags: [Orders]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Order data
 *       404:
 *         description: Order not found
 */
router.get('/:id', authenticate, getOrderById);

export default router;
