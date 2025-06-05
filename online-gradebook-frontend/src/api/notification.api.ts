import axios from 'axios';

import api from '@/config/axios.config';
import type { Notification } from '@/types/notification';

export const notificationApi = {
  async getNotifications(): Promise<Notification[]> {
    try {
      const response = await api.get('/notifications');
      return response.data;
    } catch (error) {
      if (axios.isAxiosError(error)) {
        const errorMessage = error.response?.data?.error || 'Failed to fetch notifications';
        throw new Error(errorMessage);
      }
      throw new Error('Failed to fetch notifications');
    }
  },

  async getUnreadCount(): Promise<{ count: number }> {
    try {
      const response = await api.get('/notifications/unread-count');
      return response.data;
    } catch (error) {
      if (axios.isAxiosError(error)) {
        const errorMessage = error.response?.data?.error || 'Failed to fetch unread count';
        throw new Error(errorMessage);
      }
      throw new Error('Failed to fetch unread count');
    }
  },

  async markAsRead(id: number): Promise<void> {
    try {
      await api.put(`/notifications/${id}/read`);
    } catch (error) {
      if (axios.isAxiosError(error)) {
        const errorMessage = error.response?.data?.error || 'Failed to mark as read';
        throw new Error(errorMessage);
      }
      throw new Error('Failed to mark as read');
    }
  },

  async markAllAsRead(): Promise<void> {
    try {
      await api.put('/notifications/read-all');
    } catch (error) {
      if (axios.isAxiosError(error)) {
        const errorMessage = error.response?.data?.error || 'Failed to mark all as read';
        throw new Error(errorMessage);
      }
      throw new Error('Failed to mark all as read');
    }
  },
};
