import { useState } from 'react';
import { Alert, Snackbar } from '@mui/material';
import { useTranslation } from 'react-i18next';

import { useUsers, useDeleteUser } from '../../hooks/userHooks';
import GenericList from '../common/GenericList';

export default function UserList() {
  const { t } = useTranslation();
  const { data: users = [], isLoading } = useUsers();
  const deleteUser = useDeleteUser();
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const handleDelete = async (id: number) => {
    const userToDelete = users.find((user) => user.id === id);
    if (!userToDelete) return;

    if (userToDelete.role === 'ADMIN') {
      setErrorMessage(t('error.adminDelete'));
      return;
    }

    try {
      await deleteUser.mutateAsync(id);
    } catch (error) {
      console.error('Error deleting user:', error);
      setErrorMessage(t('error.deleteUser'));
    }
  };

  return (
    <>
      <GenericList
        title={t('user.title')}
        items={users}
        isLoading={isLoading}
        onDelete={handleDelete}
        getItemId={(user) => user.id}
        getItemPrimaryText={(user) => user.username}
        getItemSecondaryText={(user) => user.email}
        getViewLink={(id) => `/users/${id}`}
        emptyListMessage={t('user.emptyListMessage')}
        showBackButton
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
