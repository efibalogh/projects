import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useForm, Controller } from 'react-hook-form';
import { useTranslation } from 'react-i18next';

import { Alert, Snackbar, TextField } from '@mui/material';

import { register as authRegister } from '../../api/auth.api';
import GenericForm from '../common/GenericForm';
import { handleApiError } from '../../utils/errorHandling';

type RegisterFormData = {
  username: string;
  email: string;
  password: string;
  confirmPassword: string;
};

function Register() {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const [error, setError] = useState<string | null>(null);
  const [ok, setOk] = useState(false);
  const form = useForm<RegisterFormData>({
    defaultValues: {
      username: '',
      email: '',
      password: '',
      confirmPassword: '',
    },
  });

  const { control, getValues } = form;

  const handleSubmit = async (data: RegisterFormData) => {
    setError(null);
    try {
      const response = await authRegister(data.username, data.password, data.email);
      if (response.user?.id) {
        setOk(true);
        setTimeout(() => {
          navigate('/auth/login');
        }, 2000);
      }
    } catch (err) {
      const errorResponse = handleApiError(err);
      setError(errorResponse.message);
    }
  };

  return (
    <>
      <GenericForm
        title={t('auth.signUp')}
        form={form}
        onSubmit={handleSubmit}
        submitLabel={t('common.signUpButton')}
        error={error}
        alternateLink="/auth/login"
        alternateText={t('auth.haveAccount')}
      >
        <Controller
          name="username"
          control={control}
          rules={{
            required: t('validation.required', { field: t('auth.username') }),
          }}
          render={({ field, fieldState: { error: fieldError } }) => (
            <TextField
              {...field}
              margin="none"
              required
              fullWidth
              label={t('auth.username')}
              autoComplete="username"
              autoFocus
              error={!!fieldError}
              helperText={fieldError?.message}
            />
          )}
        />
        <Controller
          name="email"
          control={control}
          rules={{
            required: t('validation.required', { field: t('auth.email') }),
            pattern: {
              value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
              message: t('validation.invalidEmail'),
            },
          }}
          render={({ field, fieldState: { error: fieldError } }) => (
            <TextField
              {...field}
              margin="none"
              required
              fullWidth
              label={t('auth.email')}
              type="email"
              autoComplete="email"
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
              autoComplete="new-password"
              error={!!fieldError}
              helperText={fieldError?.message}
            />
          )}
        />
        <Controller
          name="confirmPassword"
          control={control}
          rules={{
            required: t('validation.required', { field: t('auth.password') }),
            validate: (value) => value === getValues('password') || t('validation.passwordsDoNotMatch'),
          }}
          render={({ field, fieldState: { error: fieldError } }) => (
            <TextField
              {...field}
              margin="none"
              required
              fullWidth
              label={t('auth.confirmPassword')}
              type="password"
              autoComplete="new-password"
              error={!!fieldError}
              helperText={fieldError?.message}
            />
          )}
        />
      </GenericForm>
      <Snackbar open={ok} autoHideDuration={2000} anchorOrigin={{ vertical: 'top', horizontal: 'center' }}>
        <Alert severity="success">{t('auth.registrationSuccessful')}</Alert>
      </Snackbar>
    </>
  );
}

export default Register;
