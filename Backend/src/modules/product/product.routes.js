import { Router } from 'express';
import { authenticate } from '../auth/auth.middleware.js';
import upload from '../../config/multer.js';
import { addProduct, getProduct, getAllProducts, updateProduct, deleteProduct } from './product.controller.js';

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
 * /products:
 *   get:
 *     summary: List all products
 *     tags: [Products]
 *     parameters:
 *       - in: query
 *         name: category
 *         schema:
 *           type: string
 *           enum: [all, muscle, imports, exotics, originals]
 *         description: Filter by category
 *     responses:
 *       200:
 *         description: Product list
 */
router.get('/products', getAllProducts);

/**
 * @openapi
 * /products/{id}:
 *   get:
 *     summary: Get a single product
 *     tags: [Products]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Product data
 *       404:
 *         description: Product not found
 */
router.get('/products/:id', getProduct);

/**
 * @openapi
 * /products:
 *   post:
 *     summary: Create a product (admin)
 *     tags: [Products]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required: [name, series, year, price, category]
 *             properties:
 *               name:
 *                 type: string
 *               series:
 *                 type: string
 *               year:
 *                 type: string
 *               price:
 *                 type: string
 *               category:
 *                 type: string
 *                 enum: [muscle, imports, exotics, originals]
 *               badge:
 *                 type: string
 *               gradient:
 *                 type: string
 *               accent:
 *                 type: string
 *               border:
 *                 type: string
 *               image:
 *                 type: string
 *               description:
 *                 type: string
 *               specs:
 *                 type: object
 *                 properties:
 *                   scale:
 *                     type: string
 *                   material:
 *                     type: string
 *                   tampo:
 *                     type: string
 *                   limited:
 *                     type: string
 *     responses:
 *       201:
 *         description: Product created
 *       401:
 *         description: Unauthorized
 */
router.post('/products', authenticate, handleUpload, addProduct);

/**
 * @openapi
 * /products/{id}:
 *   put:
 *     summary: Update a product (admin)
 *     tags: [Products]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               name:
 *                 type: string
 *               series:
 *                 type: string
 *               year:
 *                 type: string
 *               price:
 *                 type: string
 *               category:
 *                 type: string
 *               badge:
 *                 type: string
 *               gradient:
 *                 type: string
 *               accent:
 *                 type: string
 *               border:
 *                 type: string
 *               image:
 *                 type: string
 *               description:
 *                 type: string
 *     responses:
 *       200:
 *         description: Product updated
 *       401:
 *         description: Unauthorized
 *       404:
 *         description: Product not found
 */
router.put('/products/:id', authenticate, handleUpload, updateProduct);

/**
 * @openapi
 * /products/{id}:
 *   delete:
 *     summary: Delete a product (admin)
 *     tags: [Products]
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
 *         description: Product deleted
 *       401:
 *         description: Unauthorized
 *       404:
 *         description: Product not found
 */
router.delete('/products/:id', authenticate, deleteProduct);

export default router;
