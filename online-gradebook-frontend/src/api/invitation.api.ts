import axios from 'axios';

import api from '@/config/axios.config';
import type { InviteRequest, PendingInvitation } from '@/types/invitation';

export const invitationApi = {
  async inviteStudent(data: InviteRequest): Promise<{ message: string; enrollment: Record<string, unknown> }> {
    try {
      const response = await api.post('/invitations', data);
      return response.data;
    } catch (error) {
      if (axios.isAxiosError(error)) {
        const errorMessage = error.response?.data?.error || 'Failed to send invitation';
        throw new Error(errorMessage);
      }
      throw new Error('Failed to send invitation');
    }
  },

  async respondToInvitation(
    enrollmentId: number,
    action: 'accept' | 'decline',
  ): Promise<{ message: string; status: string }> {
    try {
      const response = await api.put(`/invitations/${enrollmentId}/respond`, { action });
      return response.data;
    } catch (error) {
      if (axios.isAxiosError(error)) {
        const errorMessage = error.response?.data?.error || 'Failed to respond to invitation';
        throw new Error(errorMessage);
      }
      throw new Error('Failed to respond to invitation');
    }
  },

  async getPendingInvitations(): Promise<PendingInvitation[]> {
    try {
      const response = await api.get('/invitations/pending');
      return response.data;
    } catch (error) {
      if (axios.isAxiosError(error)) {
        const errorMessage = error.response?.data?.error || 'Failed to fetch invitations';
        throw new Error(errorMessage);
      }
      throw new Error('Failed to fetch invitations');
    }
  },
};
