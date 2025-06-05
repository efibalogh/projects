import { useState } from 'react';
import { useNavigate } from 'react-router-dom';

import { userApi } from '@/api/user.api';
import { useAuth } from '@/hooks/auth';

import AccountOverview from '@/components/users/AccountOverview';
import ProfileDetails from '@/components/users/ProfileDetails';
import ProfileForm from '@/components/users/ProfileForm';

function Profile() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const [isEditing, setIsEditing] = useState(false);

  const handleDeleteAccount = async () => {
    try {
      await userApi.deleteAccount();
      await logout();
      navigate('/auth/login', {
        replace: true,
        state: { message: 'Your account has been deleted successfully.' },
      });
    } catch (err) {
      console.error('Failed to delete account:', err);
    }
  };

  const handleEdit = () => {
    setIsEditing(true);
  };

  const handleCancelEdit = () => {
    setIsEditing(false);
  };

  const handleFormSuccess = () => {
    setIsEditing(false);
  };

  if (!user) {
    return null;
  }

  return (
    <div className="container mx-auto p-6 space-y-8">
      <div className="space-y-8">
        <div className="space-y-2 animate-fade-in">
          <h1 className="text-3xl font-bold tracking-tight bg-gradient-to-r from-primary to-primary/80 bg-clip-text text-transparent">
            Profile Settings
          </h1>
          <p className="text-muted-foreground">Manage your account information and preferences</p>
        </div>

        <div className="grid gap-6 lg:grid-cols-3">
          <div className="lg:col-span-2">
            {isEditing ? (
              <ProfileForm user={user} onCancel={handleCancelEdit} onSuccess={handleFormSuccess} />
            ) : (
              <ProfileDetails user={user} onEdit={handleEdit} />
            )}
          </div>

          <div className="space-y-6">
            <AccountOverview user={user} onDeleteAccount={handleDeleteAccount} />
          </div>
        </div>
      </div>
    </div>
  );
}

export default Profile;
