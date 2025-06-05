import bcrypt from 'bcrypt';
import { z } from 'zod';
import { userModel } from '../models/user.model.js';
import { enrollmentModel } from '../models/enrollment.model.js';
import { updateUserSchema } from '../validation/user.schemas.js';

export const updateProfile = async (req, res) => {
  console.log('PUT /api/users/profile');

  try {
    // Validate request body using schema
    const validationResult = updateUserSchema.pick({ name: true, email: true }).safeParse(req.body);

    if (!validationResult.success) {
      return res.status(400).json({
        error: 'Validation failed',
        details: validationResult.error.errors,
      });
    }

    const { name, email } = validationResult.data;
    const userId = req.user.id;

    const existingUser = await userModel.getByEmail(email);
    if (existingUser && existingUser.id !== userId) {
      return res.status(400).json({ error: 'Email is already in use' });
    }

    const updatedUser = await userModel.updateProfile(userId, { name, email });

    return res.json({
      user: {
        id: updatedUser.id,
        name: updatedUser.name,
        email: updatedUser.email,
        role: updatedUser.role,
      },
    });
  } catch (error) {
    console.error('Profile update error:', error);
    return res.status(500).json({ error: 'Failed to update profile' });
  }
};

export const updatePassword = async (req, res) => {
  console.log('PUT /api/users/password');

  try {
    // Create schema for password update
    const passwordUpdateSchema = updateUserSchema.pick({ password: true }).extend({
      currentPassword: z.string().min(1, 'Current password is required'),
      newPassword: z
        .string()
        .min(6, 'New password must be at least 6 characters')
        .max(32, 'New password must be less than 32 characters'),
    });

    const validationResult = passwordUpdateSchema.safeParse({
      currentPassword: req.body.currentPassword,
      newPassword: req.body.newPassword,
      password: req.body.newPassword, // for the original schema validation
    });

    if (!validationResult.success) {
      return res.status(400).json({
        error: 'Validation failed',
        details: validationResult.error.errors,
      });
    }

    const { currentPassword, newPassword } = validationResult.data;
    const userId = req.user.id;

    const user = await userModel.getByEmail(req.user.email);
    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }

    const isValidPassword = await bcrypt.compare(currentPassword, user.password);
    if (!isValidPassword) {
      return res.status(400).json({ error: 'Current password is incorrect' });
    }

    const hashedNewPassword = await bcrypt.hash(newPassword, 10);
    const updated = await userModel.updatePassword(userId, hashedNewPassword);

    if (!updated) {
      return res.status(500).json({ error: 'Failed to update password' });
    }

    return res.json({ message: 'Password updated successfully' });
  } catch (error) {
    console.error('Password update error:', error);
    return res.status(500).json({ error: 'Failed to update password' });
  }
};

export const updateRole = async (req, res) => {
  console.log('PUT /api/users/:userId/role');

  try {
    const { userId } = req.params;
    const { role } = req.body;

    if (!userId || !role) {
      return res.status(400).json({ error: 'User ID and role are required' });
    }

    const userIdInt = parseInt(userId, 10);
    const currentUser = await userModel.get(userIdInt);
    if (!currentUser) {
      return res.status(404).json({ error: 'User not found' });
    }

    // If promoting a student to teacher, remove all their course enrollments
    if (currentUser.role === 'student' && role === 'teacher') {
      const removedCount = await enrollmentModel.removeAllEnrollments(userIdInt);
      console.log(`Removed ${removedCount} enrollments for user ${userIdInt} when promoting to teacher`);
    }

    const updatedUser = await userModel.updateRole(userIdInt, role);

    return res.json({
      message: 'User role updated successfully',
      user: {
        id: updatedUser.id,
        name: updatedUser.name,
        email: updatedUser.email,
        role: updatedUser.role,
      },
    });
  } catch (error) {
    console.error('Role update error:', error);
    return res.status(500).json({ error: 'Failed to update user role' });
  }
};

export const deleteAccount = async (req, res) => {
  console.log('DELETE /api/users/account');

  try {
    const userId = req.user.id;

    await userModel.deleteAccount(userId);

    return req.session.destroy((err) => {
      if (err) {
        console.error('Session destroy error:', err);
      }
      res.clearCookie('connect.sid');
      return res.json({ message: 'Account deleted successfully' });
    });
  } catch (error) {
    console.error('Account deletion error:', error);
    return res.status(500).json({ error: 'Failed to delete account' });
  }
};

export const getUsers = async (req, res) => {
  console.log('GET /api/users');

  try {
    const users = await userModel.getAll();
    return res.json({ users });
  } catch (error) {
    console.error('Get users error:', error);
    return res.status(500).json({ error: 'Failed to fetch users' });
  }
};
