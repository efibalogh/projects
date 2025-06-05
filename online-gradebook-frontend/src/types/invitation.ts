export type InviteRequest = {
  email: string;
  courseId: number;
};

export type PendingInvitation = {
  id: number;
  courseId: number;
  userId: number;
  status: 'pending' | 'accepted' | 'declined';
  invitedBy: number;
  courseName: string;
  courseCode: string;
  teacherName: string;
  createdAt: string;
};
