import { Router } from "express";
import {
  register,
  loginUser,
  refreshUserSession,
  googleAuth,
  updateProfileInfo,
} from "./user.controller.js";
import { authenticate } from "./user.middleware.js";

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

/**
 * @openapi
 * /api/v1/user/google:
 *   post:
 *     summary: Google OAuth signup or login
 *     tags: [Users]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required: [credential]
 *             properties:
 *               credential:
 *                 type: string
 *                 description: Google ID token from Google Identity Services
 *     responses:
 *       200:
 *         description: Authenticated successfully
 *       400:
 *         description: Invalid Google credential
 */
router.post("/google", googleAuth);

/**
 * @openapi
 * /api/v1/user/profile:
 *   put:
 *     summary: Update user profile (phone, address)
 *     tags: [Users]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               phone:
 *                 type: string
 *               address:
 *                 type: object
 *                 properties:
 *                   street: { type: string }
 *                   city: { type: string }
 *                   state: { type: string }
 *                   zip: { type: string }
 *                   country: { type: string }
 *     responses:
 *       200:
 *         description: Profile updated
 *       401:
 *         description: Authentication required
 */
router.put("/profile", authenticate, updateProfileInfo);

export default router;
