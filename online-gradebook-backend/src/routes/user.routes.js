import { Router as expressRouter } from 'express';
import { updateProfile, updatePassword, deleteAccount, getUsers, updateRole } from '../controllers/user.controller.js';
import { requireAuth, requireTeacher } from '../middleware/auth.middleware.js';

const router = expressRouter();

// Profile management (any authenticated user)
router.put('/profile', requireAuth, updateProfile);
router.put('/password', requireAuth, updatePassword);
router.delete('/account', requireAuth, deleteAccount);

// User management (teachers only)
router.get('/', requireAuth, requireTeacher, getUsers);
router.put('/:userId/role', requireAuth, requireTeacher, updateRole);

export default router;
