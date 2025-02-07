import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useForm, Controller } from 'react-hook-form';
import { useTranslation } from 'react-i18next';

import { TextField } from '@mui/material';

import { useAuth } from '../../context/AuthContext';
import GenericForm from '../common/GenericForm';
import { handleApiError } from '../../utils/errorHandling';

type LoginFormData = {
  username: string;
  password: string;
};

function Login() {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const { login, error: authError } = useAuth();
  const [error, setError] = useState<string | null>(null);

  const form = useForm<LoginFormData>({
    defaultValues: {
      username: '',
      password: '',
    },
  });

  const { control } = form;

  const handleSubmit = async (data: LoginFormData) => {
    setError(null);
    try {
      await login(data.username, data.password);
      navigate('/events');
    } catch (err) {
      const errorResponse = handleApiError(err);
      setError(errorResponse.message);
    }
  };

  return (
    <GenericForm
      title={t('auth.signIn')}
      form={form}
      onSubmit={handleSubmit}
      submitLabel={t('common.signInButton')}
      error={error || authError}
      alternateLink="/auth/register"
      alternateText={t('auth.noAccount')}
    >
      <Controller
        name="username"
        control={control}
        rules={{
          required: t('validation.required', { field: t('auth.username') }),
          minLength: {
            value: 3,
            message: t('validation.minLength', { field: t('auth.username'), min: 3 }),
          },
        }}
        render={({ field, fieldState: { error: fieldError } }) => (
          <TextField
            {...field}
            margin="none"
            required
            fullWidth
            label={t('auth.username')}
            autoComplete="username"
            error={!!fieldError}
            helperText={fieldError?.message}
          />
        )}
      />
      <Controller
        name="password"
        control={control}
        rules={{
          required: t('validation.required', { field: t('auth.password') }),
        }}
        render={({ field, fieldState: { error: fieldError } }) => (
          <TextField
            {...field}
            margin="none"
            required
            fullWidth
            label={t('auth.password')}
            type="password"
            autoComplete="current-password"
            error={!!fieldError}
            helperText={fieldError?.message}
          />
        )}
      />
    </GenericForm>
  );
}

export default Login;
