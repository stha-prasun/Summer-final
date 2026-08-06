import { Router } from 'express';
import { authenticate } from '../auth/auth.middleware.js';
import upload from '../../config/multer.js';
import { getAllOrders, getOrderById } from './order.controller.js';


const router = Router();

/**
 * @openapi
 * /api/v1/orders:
 *   get:
 *     summary: List all Orders
 *     tags: [Orders]
 *     parameters:
 *       - in: query
 *         name: category
 *         schema:
 *           type: string
 *           enum: [all, muscle, imports, exotics, originals]
 *         description: Filter by category
 *     responses:
 *       200:
 *         description: Order list
 */
router.get('/all/:id', getAllOrders);

/**
 * @openapi
 * /api/v1/orders/{id}:
 *   get:
 *     summary: Get a single order
 *     tags: [Orders]
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
router.get('/:id', getOrderById);

export default router;