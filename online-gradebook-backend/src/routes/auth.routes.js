import { Router as expressRouter } from 'express';
import { login, register, logout, me } from '../controllers/auth.controller.js';
import { requireAuth } from '../middleware/auth.middleware.js';

const router = expressRouter();

// Authentication operations only
router.post('/login', login);
router.post('/register', register);
router.post('/logout', logout);
router.get('/me', requireAuth, me);

export default router;
