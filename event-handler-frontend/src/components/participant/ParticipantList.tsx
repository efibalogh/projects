import { useParams } from 'react-router-dom';
import { useTranslation } from 'react-i18next';

import { useEvent } from '../../hooks/eventHooks';
import { useParticipants, useDeleteParticipant } from '../../hooks/participantHooks';
import GenericList from '../common/GenericList';

export default function ParticipantList() {
  const { t } = useTranslation();
  const { eventId } = useParams<{ eventId: string }>();
  const { data: participants = [], isLoading } = useParticipants(Number(eventId));
  const deleteParticipant = useDeleteParticipant(Number(eventId));
  const { data: event } = useEvent(Number(eventId));

  return (
    <GenericList
      title={t('participants.title', { eventName: event?.name })}
      items={participants}
      isLoading={isLoading}
      onDelete={deleteParticipant.mutateAsync}
      getItemId={(participant) => participant.id}
      getItemPrimaryText={(participant) => participant.name}
      getViewLink={(id) => `/events/${eventId}/participants/${id}`}
      getEditLink={(id) => `/events/${eventId}/participants/${id}/edit`}
      emptyListMessage={t('participants.emptyListMessage')}
      showBackButton
      createNewLink={`/events/${eventId}/participants/new`}
      createNewText={t('participants.addParticipant')}
    />
  );
}
