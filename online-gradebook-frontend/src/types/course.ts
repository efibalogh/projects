import type { Task } from './task';
import type { User } from './user';

export type Course = {
  id: number;
  code: string;
  name: string;
  description: string;
  userId: number;
  tasks: Task[];
  enrollmentCount?: number;
  courseOwner?: User;
  isOwner?: boolean;
};

export type CourseRequest = {
  code: string;
  name: string;
  description: string;
};

export type EnrolledStudent = {
  id: number;
  courseId: number;
  userId: number;
  status: 'pending' | 'accepted' | 'declined';
  studentName: string;
  studentEmail: string;
  createdAt: string;
  updatedAt: string;
};
