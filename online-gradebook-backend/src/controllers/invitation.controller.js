import { inviteStudentSchema } from '../validation/course.schemas.js';
import { userModel } from '../models/user.model.js';
import { enrollmentModel } from '../models/enrollment.model.js';
import { notificationModel } from '../models/notification.model.js';
import { courseModel } from '../models/course.model.js';

export const inviteStudent = async (req, res) => {
  console.log('POST /api/invitations');

  try {
    const validatedData = inviteStudentSchema.parse(req.body);
    const { email, courseId } = validatedData;

    const course = await courseModel.get(courseId);
    if (!course) {
      return res.status(404).json({ error: 'Course not found' });
    }

    if (course.userId !== req.user.id) {
      return res.status(403).json({ error: 'You can only invite students to your own courses' });
    }

    const student = await userModel.getByEmailForInvitation(email);
    if (!student) {
      return res.status(404).json({ error: 'Student not found or user is not a student' });
    }

    const existingEnrollment = await enrollmentModel.getByUserAndCourse(student.id, courseId);
    if (existingEnrollment) {
      const statusText = existingEnrollment.status === 'pending' ? 'already invited' : 'already enrolled';
      return res.status(409).json({ error: `Student is ${statusText} in this course` });
    }

    const enrollment = await enrollmentModel.create({
      courseId,
      userId: student.id,
      invitedBy: req.user.id,
    });

    await notificationModel.create({
      userId: student.id,
      title: 'Course Invitation',
      message: `You've been invited to join the course "${course.name}" by ${req.user.name}`,
      enrollmentId: enrollment.id,
    });

    return res.status(201).json({
      message: 'Invitation sent successfully',
      enrollment,
    });
  } catch (error) {
    if (error.name === 'ZodError') {
      return res.status(400).json({
        error: 'Validation failed',
        details: error.errors,
      });
    }
    console.error('Invite student error:', error);
    return res.status(500).json({ error: error.message || 'Failed to send invitation' });
  }
};

export const respondToInvitation = async (req, res) => {
  console.log(`POST /api/invitations/${req.params.enrollmentId}`);

  try {
    const { enrollmentId } = req.params;
    const { action } = req.body;

    if (!['accept', 'decline'].includes(action)) {
      return res.status(400).json({ error: 'Action must be "accept" or "decline"' });
    }

    const enrollment = await enrollmentModel.get(enrollmentId);
    if (!enrollment) {
      return res.status(404).json({ error: 'Invitation not found' });
    }

    if (enrollment.userId !== req.user.id) {
      return res.status(403).json({ error: 'This invitation is not for you' });
    }

    if (enrollment.status !== 'pending') {
      return res.status(409).json({ error: 'This invitation has already been responded to' });
    }

    const newStatus = action === 'accept' ? 'accepted' : 'declined';
    const updated = await enrollmentModel.updateStatus(enrollmentId, newStatus, req.user.id);

    if (!updated) {
      return res.status(500).json({ error: 'Failed to update invitation status' });
    }

    await notificationModel.updateInvitationResponse(enrollmentId, action === 'accept' ? 'accepted' : 'declined');

    return res.json({
      message: `Invitation ${action}ed successfully`,
      status: newStatus,
    });
  } catch (error) {
    console.error('Respond to invitation error:', error);
    return res.status(500).json({ error: 'Failed to respond to invitation' });
  }
};

export const getPendingInvitations = async (req, res) => {
  console.log('GET /api/invitations/pending');

  try {
    const invitations = await enrollmentModel.getPendingInvitations(req.user.id);
    res.json(invitations);
  } catch (error) {
    console.error('Get pending invitations error:', error);
    res.status(500).json({ error: 'Failed to fetch invitations' });
  }
};
