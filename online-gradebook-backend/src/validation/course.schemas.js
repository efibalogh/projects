import { z } from 'zod';

export const courseSchema = z.object({
  code: z
    .string()
    .length(6, 'Course code must be 6 characters')
    .regex(/^[A-Za-z0-9]+$/u, 'Course code can only contain letters and numbers')
    .transform((val) => val.toUpperCase()),
  name: z
    .string()
    .min(3, 'Course name must be at least 3 characters')
    .max(100, 'Course name must be less than 100 characters')
    .trim(),
  description: z
    .string()
    .min(5, 'Description must be at least 5 characters')
    .max(1000, 'Description must be less than 1000 characters')
    .trim(),
});

export const taskSchema = z.object({
  name: z
    .string()
    .min(3, 'Task name must be at least 3 characters')
    .max(100, 'Task name must be less than 100 characters')
    .trim(),
  deadline: z.string().datetime('Invalid deadline format'),
});

export const inviteStudentSchema = z.object({
  email: z.string().email('Invalid email format').min(1, 'Email is required').trim(),
  courseId: z.number().int().positive('Course ID must be a positive integer'),
});
