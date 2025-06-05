import { z } from 'zod';

export const updateUserSchema = z.object({
  name: z.string().min(2, 'Name must be at least 2 characters').max(100, 'Name must be less than 100 characters'),
  email: z.string().email('Invalid email format').min(1, 'Email is required'),
  password: z
    .string()
    .min(6, 'Password must be at least 6 characters')
    .max(32, 'Password must be less than 32 characters')
    .optional(),
  role: z.enum(['student', 'teacher'], 'Invalid role').optional(),
});
