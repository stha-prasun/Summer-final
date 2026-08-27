import { Router } from 'express';
import { authenticate as userAuth } from '../user/user.middleware.js';
import { authenticate as adminAuth, isAdmin } from '../auth/auth.middleware.js';
import {
  getConversation,
  getMessages,
  sendMessage,
  markRead,
  getConversations,
  getUserUnread,
} from './chat.controller.js';

const router = Router();

// User routes
router.get('/conversation', userAuth, getConversation);
router.get('/unread', userAuth, getUserUnread);
router.get('/:id/messages', userAuth, getMessages);
router.post('/:id/messages', userAuth, sendMessage);
router.patch('/:id/read', userAuth, markRead);

// Admin routes
router.get('/admin/conversations', adminAuth, isAdmin, getConversations);
router.get('/admin/:id/messages', adminAuth, isAdmin, getMessages);
router.post('/admin/:id/messages', adminAuth, isAdmin, sendMessage);
router.patch('/admin/:id/read', adminAuth, isAdmin, markRead);

export default router;
