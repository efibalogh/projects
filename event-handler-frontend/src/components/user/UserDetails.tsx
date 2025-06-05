import { useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { useTranslation } from 'react-i18next';

import { Alert, Snackbar } from '@mui/material';

import { useUser, useDeleteUser } from '../../hooks/userHooks';
import { useAuth } from '../../context/AuthContext';
import GenericDetails from '../common/GenericDetails';

function UserDetails() {
  const { t } = useTranslation();

  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { user: currentUser } = useAuth();
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const isProfile = !id;
  const userId = isProfile ? currentUser?.id : Number(id);

  const { data: user, isLoading } = useUser(userId);
  const deleteUserMutation = useDeleteUser();

  const handleDelete = async () => {
    if (!user || user.role === 'ADMIN') return;

    try {
      await deleteUserMutation.mutateAsync(user.id);
      if (user.id === currentUser?.id) {
        navigate('/auth/logout');
      } else {
        navigate('/users');
      }
    } catch (error) {
      console.error('Error deleting user:', error);
      setErrorMessage(t('error.deleteUser'));
    }
  };

  if (!userId || (!user && isLoading)) {
    return <GenericDetails title={t('common.loading')} isLoading fields={[]} />;
  }

  if (!user && !isLoading) {
    return <GenericDetails title={t('common.errorLoading')} isLoading={false} fields={[]} />;
  }

  const fields = user
    ? [
        { label: t('auth.username'), value: user.username },
        { label: t('auth.email'), value: user.email },
        { label: t('common.theme'), value: t(`theme.${user.theme}`) },
        { label: t('common.language'), value: t(`language.${user.language}`) },
        !isProfile && { label: t('user.role'), value: user.role },
      ]
    : [];

  const canDelete = user && user.role !== 'ADMIN' && (currentUser?.role === 'ADMIN' || user.id === currentUser?.id);

  return (
    <>
      <GenericDetails
        title={isProfile ? t('common.profile') : t('user.details')}
        isLoading={isLoading}
        fields={fields.filter((field): field is { label: string; value: string } => Boolean(field))}
        onDelete={canDelete ? handleDelete : undefined}
      />
      <Snackbar
        open={!!errorMessage}
        autoHideDuration={3000}
        onClose={() => setErrorMessage(null)}
        anchorOrigin={{ vertical: 'top', horizontal: 'center' }}
      >
        <Alert onClose={() => setErrorMessage(null)} severity="error" sx={{ width: '100%' }}>
          {errorMessage}
        </Alert>
      </Snackbar>
    </>
  );
}

export default UserDetails;
