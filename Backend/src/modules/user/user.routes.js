import { Router } from "express";
import { register, loginUser, refreshUserSession } from "./user.controller.js";

const router = Router();

/**
 * @openapi
 * /api/v1/user/register:
 *   post:
 *     summary: User registration
 *     tags: [Users]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required: [name, email, password, phone]
 *             properties:
 *               name:
 *                 type: string
 *               email:
 *                 type: string
 *               password:
 *                 type: string
 *               phone:
 *                 type: string
 *               address:
 *                 type: object
 *                 required: [street, city, state, zip, country]
 *                 properties:
 *                   street:
 *                     type: string
 *                   city:
 *                     type: string
 *                   state:
 *                     type: string
 *                   zip:
 *                     type: string
 *                   country:
 *                     type: string
 *     responses:
 *       201:
 *         description: Account created successfully
 *       400:
 *         description: Validation error
 */
router.post("/register", register);

/**
 * @openapi
 * /api/v1/user/login:
 *   post:
 *     summary: User login
 *     tags: [Users]
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
router.post("/login", loginUser);

/**
 * @openapi
 * /api/v1/user/refresh:
 *   post:
 *     summary: Refresh access token
 *     tags: [Users]
 *     responses:
 *       200:
 *         description: Tokens refreshed
 *       401:
 *         description: Invalid or expired refresh token
 */
router.post("/refresh", refreshUserSession);

export default router;
