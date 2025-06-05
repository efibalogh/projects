import { userApi } from './axios.config';
import { User } from '../types/user';

export const fetchUsers = async (): Promise<User[]> => {
  const response = await userApi.get('');
  return response.data;
};

export const fetchUser = async (id: number): Promise<User> => {
  const response = await userApi.get(`/${id}`);
  return response.data;
};

export const deleteUser = async (id: number): Promise<void> => {
  await userApi.delete(`/${id}`);
};

export const updateTheme = async (id: number, theme: string): Promise<void> => {
  await userApi.put(`/${id}/theme`, { theme });
};

export const updateLanguage = async (id: number, language: string): Promise<void> => {
  console.log({ language });
  await userApi.put(`/${id}/language`, { language });
};
