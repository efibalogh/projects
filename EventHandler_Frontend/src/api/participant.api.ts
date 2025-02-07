import { api } from './axios.config';
import { ParticipantIncoming, ParticipantOutgoing } from '../types/participant';

export const fetchParticipants = async (eventId: number): Promise<ParticipantOutgoing[]> => {
  const response = await api.get(`/${eventId}/participants`);
  return response.data;
};

export const fetchParticipant = async (eventId: number, participantId: number): Promise<ParticipantOutgoing> => {
  const response = await api.get(`/${eventId}/participants/${participantId}`);
  return response.data;
};

export const createParticipant = async (
  eventId: number,
  participant: ParticipantIncoming,
): Promise<ParticipantOutgoing> => {
  console.log(participant);
  const response = await api.post(`/${eventId}/participants`, participant);
  return response.data;
};

export const updateParticipant = async (
  eventId: number,
  participantId: number,
  participant: ParticipantIncoming,
): Promise<void> => {
  await api.put(`/${eventId}/participants/${participantId}`, participant);
};

export const deleteParticipant = async (eventId: number, participantId: number): Promise<void> => {
  await api.delete(`/${eventId}/participants/${participantId}`);
};
