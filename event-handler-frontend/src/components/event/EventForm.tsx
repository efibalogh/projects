import { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useForm, Controller } from 'react-hook-form';
import { useTranslation } from 'react-i18next';
import { TextField } from '@mui/material';

import { EventIncoming } from '../../types/event';
import { useCreateEvent, useUpdateEvent, useEvent } from '../../hooks/eventHooks';
import GenericForm from '../common/GenericForm';
import { handleApiError } from '../../utils/errorHandling';

const today = new Date().toISOString().split('T')[0];

function EventForm() {
  const { t } = useTranslation();
  const { id } = useParams<{ id?: string }>();
  const navigate = useNavigate();
  const isEditMode = Boolean(id);
  const [error, setError] = useState<string | null>(null);

  const { data: existingEvent, isLoading } = useEvent(id ? Number(id) : undefined);
  const createEvent = useCreateEvent();
  const updateEvent = useUpdateEvent();

  const form = useForm<EventIncoming>({
    defaultValues: {
      name: existingEvent?.name || '',
      location: existingEvent?.location || '',
      startDate: existingEvent?.startDate || today,
      endDate: existingEvent?.endDate || today,
    },
    values: existingEvent,
  });

  const { control, watch } = form;
  const startDate = watch('startDate');
  const endDate = watch('endDate');

  const onSubmit = async (data: EventIncoming) => {
    setError(null);
    try {
      if (isEditMode) {
        await updateEvent.mutateAsync({ id: Number(id), event: data });
        navigate(`/events/${id}`);
      } else {
        const newId = await createEvent.mutateAsync(data);
        navigate(`/events/${newId}`);
      }
    } catch (err) {
      const errorResponse = handleApiError(err);
      setError(errorResponse.message);
    }
  };

  if (isEditMode && isLoading) {
    return (
      <GenericForm title="Loading..." form={form} onSubmit={onSubmit}>
        {null}
      </GenericForm>
    );
  }

  return (
    <GenericForm
      title={isEditMode ? t('events.edit') : t('events.addEvent')}
      form={form}
      onSubmit={onSubmit}
      submitLabel={isEditMode ? t('common.updateButton') : t('common.createButton')}
      error={error}
    >
      <Controller
        name="name"
        control={control}
        rules={{ required: 'Name is required' }}
        render={({ field, fieldState: { error: fieldError } }) => (
          <TextField
            {...field}
            margin="none"
            label={t('events.name')}
            fullWidth
            required
            error={!!fieldError}
            helperText={fieldError?.message}
          />
        )}
      />
      <Controller
        name="location"
        control={control}
        rules={{ required: 'Location is required' }}
        render={({ field, fieldState: { error: fieldError } }) => (
          <TextField
            {...field}
            margin="none"
            label={t('events.location')}
            fullWidth
            required
            error={!!fieldError}
            helperText={fieldError?.message}
          />
        )}
      />
      <Controller
        name="startDate"
        control={control}
        rules={{
          required: 'Start date is required',
          validate: (value) => value <= endDate || 'Start date cannot be after end date!',
        }}
        render={({ field, fieldState: { error: fieldError } }) => (
          <TextField
            {...field}
            label={t('events.startDate')}
            type="date"
            fullWidth
            required
            error={!!fieldError}
            helperText={fieldError?.message}
            slotProps={{
              inputLabel: {
                shrink: true,
              },
            }}
          />
        )}
      />
      <Controller
        name="endDate"
        control={control}
        rules={{
          required: 'End date is required',
          validate: (value) => value >= startDate || 'End date cannot be before start date!',
        }}
        render={({ field, fieldState: { error: fieldError } }) => (
          <TextField
            {...field}
            label={t('events.endDate')}
            type="date"
            fullWidth
            required
            error={!!fieldError}
            helperText={fieldError?.message}
            slotProps={{
              inputLabel: {
                shrink: true,
              },
            }}
          />
        )}
      />
    </GenericForm>
  );
}

export default EventForm;
