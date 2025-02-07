import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';

import { fetchEvents, fetchEvent, createEvent, updateEvent, deleteEvent, searchEvents } from '../api/event.api';
import { EventIncoming, EventOutgoing } from '../types/event';

export const useEvents = () => {
  return useQuery({
    queryKey: ['events'],
    queryFn: fetchEvents,
    staleTime: 30000,
  });
};

export const useEvent = (id: number | undefined, enabled: boolean = true) => {
  return useQuery({
    queryKey: ['events', id],
    queryFn: () => fetchEvent(id!),
    enabled: !!id && enabled,
    staleTime: 30000,
  });
};

export const useCreateEvent = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (event: EventIncoming) => createEvent(event),
    onSuccess: (newEvent: EventOutgoing) => {
      queryClient.invalidateQueries({ queryKey: ['events'] });
      return newEvent.id;
    },
  });
};

export const useUpdateEvent = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (data: { id: number; event: EventIncoming }) => updateEvent(data.id, data.event),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['events'] });
    },
  });
};

export const useDeleteEvent = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (id: number) => deleteEvent(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['events'] });
    },
  });
};

export const useSearchEvents = (filter: EventIncoming | null) => {
  return useQuery({
    queryKey: ['events', 'search', filter],
    queryFn: () => (filter ? searchEvents(filter) : Promise.resolve([])),
    enabled: !!filter,
    staleTime: 30000,
  });
};
