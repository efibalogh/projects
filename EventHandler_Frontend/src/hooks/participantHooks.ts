import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';

import {
  fetchParticipants,
  createParticipant,
  updateParticipant,
  deleteParticipant,
  fetchParticipant,
} from '../api/participant.api';
import { ParticipantIncoming, ParticipantOutgoing } from '../types/participant';

export const useParticipants = (eventId: number) => {
  return useQuery({
    queryKey: ['participants', eventId],
    queryFn: () => fetchParticipants(eventId),
    staleTime: 30000,
  });
};

export const useParticipant = (eventId: number, participantId: number | undefined, enabled: boolean = true) => {
  return useQuery({
    queryKey: ['participants', eventId, participantId],
    queryFn: () => fetchParticipant(eventId, participantId!),
    enabled: !!participantId && enabled,
    staleTime: 30000,
  });
};

export const useCreateParticipant = (eventId: number) => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (participant: ParticipantIncoming) => createParticipant(eventId, participant),
    onSuccess: (newParticipant: ParticipantOutgoing) => {
      queryClient.invalidateQueries({ queryKey: ['participants', eventId] });
      queryClient.invalidateQueries({ queryKey: ['events', eventId] });
      return newParticipant.id;
    },
  });
};

export const useUpdateParticipant = (eventId: number) => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (data: { id: number; participant: ParticipantIncoming }) =>
      updateParticipant(eventId, data.id, data.participant),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['participants', eventId] });
      queryClient.invalidateQueries({ queryKey: ['events', eventId] });
    },
  });
};

export const useDeleteParticipant = (eventId: number) => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (id: number) => deleteParticipant(eventId, id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['participants', eventId] });
      queryClient.invalidateQueries({ queryKey: ['events', eventId] });
    },
  });
};
