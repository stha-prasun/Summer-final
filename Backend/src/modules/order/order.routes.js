import { Router } from 'express';
import { authenticate } from '../auth/auth.middleware.js';
import upload from '../../config/multer.js';
import { getAllOrders, getOrderById } from './order.controller.js';


const router = Router();

const handleUpload = (req, res, next) => {
  upload.single('image')(req, res, (err) => {
    if (err) {
      return res.status(400).json({ success: false, message: err.message });
    }
    next();
  });
};

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
router.get('/', getAllOrders);

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