import { useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { useParticipant, useDeleteParticipant } from '../../hooks/participantHooks';
import GenericDetails from '../common/GenericDetails';

function ParticipantDetails() {
  const { t } = useTranslation();
  const { eventId } = useParams<{ eventId: string }>();
  const { id } = useParams<{ id: string }>();
  const [isDeleted, setDeleted] = useState(false);
  const { data: participant, isLoading, isError } = useParticipant(Number(eventId), Number(id), !isDeleted);
  const deleteParticipant = useDeleteParticipant(Number(eventId));
  const navigate = useNavigate();

  if (isError) {
    return <GenericDetails title="Error" isLoading={false} fields={[]} />;
  }

  const handleDelete = async () => {
    setDeleted(true);
    await deleteParticipant.mutateAsync(Number(id));
    navigate(`/events/${eventId}`);
  };

  const fields = participant
    ? [
        { label: t('participants.name'), value: participant.name },
        { label: t('participants.email'), value: participant.email },
        { label: t('participants.phone'), value: participant.phoneNumber },
      ].filter((field) => field.value)
    : [];

  return (
    <GenericDetails
      title={t('participants.details')}
      isLoading={isLoading}
      fields={fields}
      editLink={participant ? `/events/${eventId}/participants/${participant.id}/edit` : undefined}
      onDelete={handleDelete}
    />
  );
}

export default ParticipantDetails;
