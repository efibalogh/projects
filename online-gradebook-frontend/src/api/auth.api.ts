import axios from 'axios';

import api from '@/config/axios.config';
import type { AuthResponse, LoginRequest, RegisterRequest, User } from '@/types/user';

export const authApi = {
  async login(credentials: LoginRequest): Promise<AuthResponse> {
    try {
      const response = await api.post('/auth/login', credentials);
      return response.data;
    } catch (error) {
      if (axios.isAxiosError(error)) {
        const errorMessage = error.response?.data?.error || 'Login failed';
        throw new Error(errorMessage);
      } else {
        console.error('Login error:', error);
      }
      throw new Error('Login failed');
    }
  },

  async register(userData: RegisterRequest): Promise<AuthResponse> {
    try {
      const response = await api.post('/auth/register', userData);
      return response.data;
    } catch (error) {
      if (axios.isAxiosError(error)) {
        console.error('Registration API error:', error.response?.data);
        const errorMessage = error.response?.data?.error || 'Registration failed';
        throw new Error(errorMessage);
      } else {
        console.error('Registration error:', error);
      }
      throw new Error('Registration failed');
    }
  },

  async logout(): Promise<{ message: string }> {
    try {
      const response = await api.post('/auth/logout');
      return response.data;
    } catch (error) {
      if (axios.isAxiosError(error)) {
        const errorMessage = error.response?.data?.error || 'Logout failed';
        throw new Error(errorMessage);
      }
      throw new Error('Logout failed');
    }
  },

  async me(): Promise<{ user: User }> {
    try {
      const response = await api.get('/auth/me');
      return response.data;
    } catch (error) {
      if (axios.isAxiosError(error)) {
        const errorMessage = error.response?.data?.error || 'Failed to get user info';
        throw new Error(errorMessage);
      }
      throw new Error('Failed to get user info');
    }
  },
};
