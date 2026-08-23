import { Router } from 'express';
import { authenticate, isAdmin } from '../auth/auth.middleware.js';
import { sendBulkEmail } from './bulkEmail.controller.js';

const router = Router();

router.post('/bulk-email', authenticate, isAdmin, sendBulkEmail);

export default router;
