export type User = {
  id: number;
  name: string;
  email: string;
  role: 'student' | 'teacher';
};

export type LoginRequest = {
  email: string;
  password: string;
};

export type RegisterRequest = {
  name: string;
  email: string;
  password: string;
  confirmPassword: string;
};

export type AuthResponse = {
  message: string;
  user: User;
};

export type UpdateProfileRequest = {
  name: string;
  email: string;
};

export type UpdatePasswordRequest = {
  currentPassword: string;
  newPassword: string;
};
