import { authApi } from './axios.config';
import { User } from '../types/user';

type AuthResponse = {
  token: string | null;
  message: string;
  user?: User;
};

export const login = async (username: string, password: string): Promise<AuthResponse> => {
  try {
    const response = await authApi.post<AuthResponse>('/login', { username, password });
    return response.data;
  } catch (error) {
    console.log('Login error details:', error);
    throw error;
  }
};

export const register = async (username: string, password: string, email: string): Promise<AuthResponse> => {
  try {
    const response = await authApi.post<AuthResponse>('/register', { username, password, email });
    return response.data;
  } catch (error) {
    console.error('Registration error details:', error);
    throw error;
  }
};

export const logout = async (): Promise<void> => {
  await authApi.post('/logout');
};
