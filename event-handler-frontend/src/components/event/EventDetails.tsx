import { useState } from 'react';
import { useNavigate, useParams, Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { useEvent, useDeleteEvent } from '../../hooks/eventHooks';
import GenericDetails from '../common/GenericDetails';

function EventDetails() {
  const { t } = useTranslation();
  const { id } = useParams<{ id: string }>();
  const [isDeleted, setDeleted] = useState(false);
  const { data: event, isLoading, isError } = useEvent(Number(id), !isDeleted);
  const deleteEvent = useDeleteEvent();
  const navigate = useNavigate();

  if (isError) {
    return <GenericDetails title="Error" isLoading={false} fields={[]} />;
  }

  const handleDelete = async () => {
    setDeleted(true);
    await deleteEvent.mutateAsync(Number(id));
    navigate('/events');
  };

  const fields = event
    ? [
        { label: t('events.name'), value: event.name },
        { label: t('events.location'), value: event.location },
        { label: t('events.startDate'), value: event.startDate },
        { label: t('events.endDate'), value: event.endDate },
        ...(event.participants.length > 0
          ? [
              {
                label: <Link to={`/events/${event.id}/participants`}>{t('events.participants')}</Link>,
                value: event.participants.length,
              },
            ]
          : []),
      ]
    : [];

  return (
    <GenericDetails
      title={t('events.details')}
      isLoading={isLoading}
      fields={fields}
      editLink={event ? `/events/${event.id}/edit` : undefined}
      onDelete={handleDelete}
      createButtonLink={event ? `/events/${event.id}/participants/new` : undefined}
      createButtonText={t('events.addParticipant')}
    />
  );
}

export default EventDetails;
