import { Router } from 'express';
import { authenticate, isAdmin } from '../auth/auth.middleware.js';
import { getDashboardStats } from './admin.controller.js';

const router = Router();

router.get('/stats', authenticate, isAdmin, getDashboardStats);

export default router;
