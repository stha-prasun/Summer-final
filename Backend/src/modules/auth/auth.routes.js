import { Router } from "express";
import { login, refresh } from "./auth.controller.js";

const router = Router();

/**
 * @openapi
 * /api/v1/admin/login:
 *   post:
 *     summary: Admin login
 *     tags: [Admin]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required: [email, password]
 *             properties:
 *               email:
 *                 type: string
 *               password:
 *                 type: string
 *     responses:
 *       200:
 *         description: Login successful
 *       400:
 *         description: Invalid credentials
 */
router.post("/login", login);

/**
 * @openapi
 * /api/v1/admin/refresh:
 *   post:
 *     summary: Refresh access token
 *     tags: [Admin]
 *     responses:
 *       200:
 *         description: Tokens refreshed
 *       401:
 *         description: Invalid or expired refresh token
 */
router.post("/refresh", refresh);

export default router;
