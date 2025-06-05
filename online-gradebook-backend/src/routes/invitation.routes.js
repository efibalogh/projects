import { Router as expressRouter } from 'express';
import { getPendingInvitations, inviteStudent, respondToInvitation } from '../controllers/invitation.controller.js';
import { requireAuth, requireTeacher } from '../middleware/auth.middleware.js';

const router = expressRouter();

// Invitation routes
router.post('/', requireAuth, requireTeacher, inviteStudent);
router.put('/:enrollmentId/respond', requireAuth, respondToInvitation);
router.get('/pending', requireAuth, getPendingInvitations);

export default router;
