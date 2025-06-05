import { useState } from 'react';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { updateTheme, updateLanguage, deleteUser, fetchUsers, fetchUser } from '../api/user.api';

export const useUsers = () => {
  return useQuery({
    queryKey: ['users'],
    queryFn: fetchUsers,
    staleTime: 30000,
  });
};

export const useUser = (id: number | undefined, enabled: boolean = true) => {
  return useQuery({
    queryKey: ['users', id],
    queryFn: () => fetchUser(id!),
    enabled: !!id && enabled,
    staleTime: 30000,
  });
};

export const useDeleteUser = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (id: number) => deleteUser(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['users'] });
    },
  });
};

export const useUserPreferences = (userId: number) => {
  const [isUpdating, setIsUpdating] = useState(false);
  const queryClient = useQueryClient();

  const changeTheme = async (theme: string) => {
    setIsUpdating(true);
    try {
      await updateTheme(userId, theme);
      queryClient.invalidateQueries({ queryKey: ['users', userId] });
    } catch (error) {
      console.error('Error updating theme:', error);
      throw error;
    } finally {
      setIsUpdating(false);
    }
  };

  const changeLanguage = async (language: string) => {
    setIsUpdating(true);
    try {
      await updateLanguage(userId, language);
      queryClient.invalidateQueries({ queryKey: ['users', userId] });
    } catch (error) {
      console.error('Error updating language:', error);
      throw error;
    } finally {
      setIsUpdating(false);
    }
  };

  return {
    isUpdating,
    changeTheme,
    changeLanguage,
  };
};
