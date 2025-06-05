import { Router as expressRouter } from 'express';
import {
  getUnreadCount,
  getUserNotifications,
  markAllAsRead,
  markAsRead,
} from '../controllers/notification.controller.js';
import { requireAuth } from '../middleware/auth.middleware.js';

const router = expressRouter();

// Notification routes
router.get('/', requireAuth, getUserNotifications);
router.get('/unread-count', requireAuth, getUnreadCount);
router.put('/:id/read', requireAuth, markAsRead);
router.put('/read-all', requireAuth, markAllAsRead);

export default router;
