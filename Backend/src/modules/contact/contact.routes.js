import { Router } from 'express';
import { submit } from './contact.controller.js';

const router = Router();

/**
 * @openapi
 * /api/v1/contact:
 *   post:
 *     summary: Submit a contact form message
 *     tags: [Contact]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required: [name, email, message]
 *             properties:
 *               name:
 *                 type: string
 *               email:
 *                 type: string
 *               subject:
 *                 type: string
 *               message:
 *                 type: string
 *     responses:
 *       201:
 *         description: Message saved successfully
 *       400:
 *         description: Missing required fields
 */
router.post('/', submit);

export default router;
