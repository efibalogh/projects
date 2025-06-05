import { useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { useForm, Controller } from 'react-hook-form';
import { useTranslation } from 'react-i18next';

import { TextField } from '@mui/material';

import { ParticipantIncoming } from '../../types/participant';
import { useCreateParticipant, useUpdateParticipant, useParticipant } from '../../hooks/participantHooks';
import GenericForm from '../common/GenericForm';
import { handleApiError } from '../../utils/errorHandling';

function ParticipantForm() {
  const { t } = useTranslation();
  const { eventId, id } = useParams<{ eventId: string; id: string }>();
  const navigate = useNavigate();
  const isEditMode = Boolean(id);
  const [error, setError] = useState<string | null>(null);

  const { data: existingParticipant, isLoading } = useParticipant(Number(eventId), id ? Number(id) : undefined);
  const createParticipant = useCreateParticipant(Number(eventId));
  const updateParticipant = useUpdateParticipant(Number(eventId));

  const form = useForm<ParticipantIncoming>({
    defaultValues: {
      name: existingParticipant?.name || '',
      email: existingParticipant?.email || undefined,
      phoneNumber: existingParticipant?.phoneNumber || undefined,
    },
    values: existingParticipant,
  });

  const { control } = form;

  const onSubmit = async (data: ParticipantIncoming) => {
    setError(null);
    try {
      if (isEditMode) {
        await updateParticipant.mutateAsync({ id: Number(id), participant: data });
      } else {
        const newId = await createParticipant.mutateAsync(data);
        navigate(`/events/${eventId}/participants/${newId}`);
      }
      navigate(`/events/${eventId}/participants`);
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
      title={isEditMode ? t('participants.edit') : t('participants.create')}
      form={form}
      onSubmit={onSubmit}
      submitLabel={isEditMode ? t('common.updateButton') : t('common.createButton')}
      error={error}
    >
      <Controller
        name="name"
        control={control}
        rules={{ required: t('validation.required', { field: t('participants.name') }) }}
        render={({ field, fieldState: { error: fieldError } }) => (
          <TextField
            {...field}
            margin="none"
            label={t('participants.name')}
            fullWidth
            required
            error={!!fieldError}
            helperText={fieldError?.message}
          />
        )}
      />
      <Controller
        name="email"
        control={control}
        rules={{
          pattern: {
            value: /^[A-Z0-9._]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
            message: t('validation.invalidEmail'),
          },
        }}
        render={({ field, fieldState: { error: fieldError } }) => (
          <TextField
            {...field}
            margin="none"
            label={t('participants.email')}
            type="email"
            fullWidth
            error={!!fieldError}
            helperText={fieldError?.message}
          />
        )}
      />
      <Controller
        name="phoneNumber"
        control={control}
        rules={{
          pattern: {
            value: /^\+?[1-9][0-9]{5,9}$/,
            message: t('validation.invalidPhoneNumber'),
          },
        }}
        render={({ field, fieldState: { error: fieldError } }) => (
          <TextField
            {...field}
            margin="none"
            label={t('participants.phone')}
            fullWidth
            error={!!fieldError}
            helperText={fieldError?.message}
          />
        )}
      />
    </GenericForm>
  );
}

export default ParticipantForm;
