import { Router } from 'express';
import { authenticate } from '../user/user.middleware.js';
import { initiate, verify } from './payment.controller.js';

const router = Router();

/**
 * @openapi
 * /api/v1/payment/initiate:
 *   post:
 *     summary: Initiate a Khalti payment
 *     description: Creates an order, initiates payment with Khalti, and returns the payment URL to redirect the user to.
 *     tags: [Payments]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required: [items]
 *             properties:
 *               items:
 *                 type: array
 *                 description: Cart items to be purchased
 *                 items:
 *                   type: object
 *                   required: [productId, quantity]
 *                   properties:
 *                     productId:
 *                       type: string
 *                     quantity:
 *                       type: integer
 *                       minimum: 1
 *               customer:
 *                 type: object
 *                 description: Optional customer information passed to Khalti
 *                 properties:
 *                   name:
 *                     type: string
 *                   email:
 *                     type: string
 *                   phone:
 *                     type: string
 *     responses:
 *       200:
 *         description: Payment initiated successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                 message:
 *                   type: string
 *                 pidx:
 *                   type: string
 *                 payment_url:
 *                   type: string
 *                 purchase_order_id:
 *                   type: string
 *       400:
 *         description: Invalid request (empty cart or unknown product)
 *       401:
 *         description: Authentication required
 */
router.post('/initiate', authenticate, initiate);

/**
 * @openapi
 * /api/v1/payment/verify:
 *   post:
 *     summary: Verify a Khalti payment
 *     description: Verifies a payment using the pidx returned after the user completes payment on Khalti.
 *     tags: [Payments]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required: [pidx]
 *             properties:
 *               pidx:
 *                 type: string
 *                 description: Payment identifier returned during initiation
 *     responses:
 *       200:
 *         description: Verification result
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   description: True only when status is Completed
 *                 message:
 *                   type: string
 *                 status:
 *                   type: string
 *                   enum: [Completed, Pending, User canceled]
 *                 transactionId:
 *                   type: string
 *                 totalAmount:
 *                   type: integer
 *                   description: Amount in paisa
 *                 purchaseOrderId:
 *                   type: string
 *       400:
 *         description: Invalid request (missing pidx)
 *       401:
 *         description: Authentication required
 */
router.post('/verify', authenticate, verify);

export default router;
