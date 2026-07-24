import { Router } from 'express';

const router = Router();

/**
 * @openapi
 * /check:
 *   get:
 *     summary: Health check endpoint
 *     tags: [Health]
 *     responses:
 *       200:
 *         description: API is running
 *         content:
 *           text/plain:
 *             schema:
 *               type: string
 *               example: API Health Check
 */
router.get('/check', (req, res) => {
  res.send('API Health Check');
});

export default router;
