import axios from 'axios';

import api from '@/config/axios.config';
import type { UpdatePasswordRequest, UpdateProfileRequest, User } from '@/types/user';

export const userApi = {
  async getUsers(): Promise<{ users: User[] }> {
    try {
      const response = await api.get('/users');
      return response.data;
    } catch (error) {
      if (axios.isAxiosError(error)) {
        const errorMessage = error.response?.data?.error || 'Failed to fetch users';
        throw new Error(errorMessage);
      } else {
        console.error('Failed to fetch users:', error);
      }
      throw new Error('Failed to fetch users');
    }
  },

  async updateProfile(data: UpdateProfileRequest): Promise<{ message: string; user: User }> {
    try {
      const response = await api.put('/users/profile', data);
      return response.data;
    } catch (error) {
      if (axios.isAxiosError(error)) {
        const errorMessage = error.response?.data?.error || 'Failed to update profile';
        throw new Error(errorMessage);
      } else {
        console.error('Failed to update profile:', error);
      }
      throw new Error('Failed to update profile');
    }
  },

  async updatePassword(data: UpdatePasswordRequest): Promise<{ message: string }> {
    try {
      const response = await api.put('/users/password', data);
      return response.data;
    } catch (error) {
      if (axios.isAxiosError(error)) {
        const errorMessage = error.response?.data?.error || 'Failed to update password';
        throw new Error(errorMessage);
      } else {
        console.error('Failed to update password:', error);
      }
      throw new Error('Failed to update password');
    }
  },

  async updateRole(userId: number, role: 'student' | 'teacher'): Promise<{ message: string; user: User }> {
    try {
      const response = await api.put(`/users/${userId}/role`, { role });
      return response.data;
    } catch (error) {
      if (axios.isAxiosError(error)) {
        const errorMessage = error.response?.data?.error || 'Failed to update user role';
        throw new Error(errorMessage);
      } else {
        console.error('Failed to update user role:', error);
      }
      throw new Error('Failed to update user role');
    }
  },

  async deleteAccount(): Promise<{ message: string }> {
    try {
      const response = await api.delete('/users/account');
      return response.data;
    } catch (error) {
      if (axios.isAxiosError(error)) {
        const errorMessage = error.response?.data?.error || 'Failed to delete account';
        throw new Error(errorMessage);
      } else {
        console.error('Failed to delete account:', error);
      }
      throw new Error('Failed to delete account');
    }
  },
};
