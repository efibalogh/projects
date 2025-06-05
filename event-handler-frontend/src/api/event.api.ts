import { api } from './axios.config';
import { EventIncoming, EventOutgoing } from '../types/event';

export const fetchEvents = async (): Promise<EventOutgoing[]> => {
  const response = await api.get('');
  return response.data;
};

export const fetchEvent = async (id: number): Promise<EventOutgoing> => {
  const response = await api.get(`/${id}`);
  return response.data;
};

export const createEvent = async (event: EventIncoming): Promise<EventOutgoing> => {
  const response = await api.post('', event);
  return response.data;
};

export const updateEvent = async (id: number, event: EventIncoming): Promise<void> => {
  await api.put(`/${id}`, event);
};

export const deleteEvent = async (id: number): Promise<void> => {
  await api.delete(`/${id}`);
};

export const searchEvents = async (filter: EventIncoming): Promise<EventOutgoing[]> => {
  const response = await api.post('/search', filter);
  return response.data;
};
