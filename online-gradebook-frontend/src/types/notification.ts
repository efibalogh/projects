export type Notification = {
  id: number;
  userId: number;
  title: string;
  message: string;
  enrollmentId: number;
  enrollmentStatus: 'pending' | 'accepted' | 'declined';
  courseId: number;
  courseName: string;
  courseCode: string;
  teacherName: string;
  isRead: boolean;
  createdAt: string;
};
