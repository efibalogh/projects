import { useState } from 'react';

import { Alert, AlertDescription } from '@/components/ui/alert';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { AlertTriangle, CheckCircle, Eye, EyeOff, Lock, Mail, Save, Shield, User } from 'lucide-react';

import { userApi } from '@/api/user.api';

import type { User as UserType } from '@/types/user';

type ProfileFormProps = {
  user: UserType;
  onCancel: () => void;
  onSuccess: () => void;
};

function ProfileForm({ user, onCancel, onSuccess }: ProfileFormProps) {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);
  const [showPasswords, setShowPasswords] = useState({
    current: false,
    new: false,
    confirm: false,
  });

  const [formData, setFormData] = useState({
    name: user.name,
    email: user.email,
    currentPassword: '',
    newPassword: '',
    confirmPassword: '',
  });

  const handleInputChange = (field: string, value: string) => {
    setFormData((prev) => ({
      ...prev,
      [field]: value,
    }));
  };

  const togglePasswordVisibility = (field: 'current' | 'new' | 'confirm') => {
    setShowPasswords((prev) => ({
      ...prev,
      [field]: !prev[field],
    }));
  };

  const handleSave = async () => {
    setError(null);
    setSuccess(null);

    if (!formData.name.trim()) {
      setError('Name is required');
      return;
    }

    if (!formData.email.trim()) {
      setError('Email is required');
      return;
    }

    // If password fields are filled, validate them
    const isPasswordUpdate = formData.currentPassword || formData.newPassword || formData.confirmPassword;

    if (isPasswordUpdate) {
      if (!formData.currentPassword || !formData.newPassword || !formData.confirmPassword) {
        setError('All password fields are required when updating password');
        return;
      }
      if (formData.newPassword.length < 6) {
        setError('New password must be at least 6 characters');
        return;
      }
      if (formData.newPassword !== formData.confirmPassword) {
        setError('Passwords do not match');
        return;
      }
    }

    setIsLoading(true);

    try {
      await userApi.updateProfile({
        name: formData.name,
        email: formData.email,
      });

      if (isPasswordUpdate) {
        await userApi.updatePassword({
          currentPassword: formData.currentPassword,
          newPassword: formData.newPassword,
        });
      }

      const message = isPasswordUpdate ? 'Profile and password updated successfully!' : 'Profile updated successfully!';

      setSuccess(message);

      setTimeout(() => {
        setSuccess(null);
        onSuccess();
      }, 2000);
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to update profile';
      setError(errorMessage);
    } finally {
      setIsLoading(false);
    }
  };

  const handleCancel = () => {
    setFormData({
      name: user.name,
      email: user.email,
      currentPassword: '',
      newPassword: '',
      confirmPassword: '',
    });
    setError(null);
    setSuccess(null);
    onCancel();
  };

  return (
    <Card className="card-modern">
      <CardHeader>
        <div>
          <CardTitle className="flex items-center gap-2 text-lg">Account Information</CardTitle>
          <CardDescription className="pt-1">Update your personal information and password</CardDescription>
        </div>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* Alert Messages */}
        {success && (
          <Alert className="border-green-500/50 text-green-700 bg-green-50 dark:bg-green-950/20">
            <CheckCircle className="h-4 w-4" />
            <AlertDescription>{success}</AlertDescription>
          </Alert>
        )}

        {error && (
          <Alert className="border-destructive/50 text-destructive">
            <AlertTriangle className="h-4 w-4" />
            <AlertDescription>{error}</AlertDescription>
          </Alert>
        )}

        <div className="space-y-4">
          {/* Profile Fields */}
          <div className="space-y-2">
            <Label htmlFor="name">Full Name</Label>
            <div className="relative">
              <User className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                id="name"
                value={formData.name}
                onChange={(e) => handleInputChange('name', e.target.value)}
                placeholder="Enter your full name"
                disabled={isLoading}
                className="pl-10 h-11"
              />
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="email">Email Address</Label>
            <div className="relative">
              <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                id="email"
                type="email"
                value={formData.email}
                onChange={(e) => handleInputChange('email', e.target.value)}
                placeholder="Enter your email address"
                disabled={isLoading}
                className="pl-10 h-11"
              />
            </div>
          </div>

          {/* Password Fields */}
          <div className="border-t border-border/50 pt-6 mt-6">
            <div className="space-y-4">
              <div className="space-y-1">
                <h4 className="text-sm font-medium flex items-center gap-2">Change Password (Optional)</h4>
                <p className="text-xs text-muted-foreground">
                  Leave password fields empty to keep your current password
                </p>
              </div>

              <div className="space-y-2">
                <Label htmlFor="currentPassword">Current Password</Label>
                <div className="relative">
                  <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                  <Input
                    id="currentPassword"
                    type={showPasswords.current ? 'text' : 'password'}
                    value={formData.currentPassword}
                    onChange={(e) => handleInputChange('currentPassword', e.target.value)}
                    placeholder="Enter current password"
                    disabled={isLoading}
                    className="h-11 pl-10 pr-10"
                  />
                  <Button
                    type="button"
                    variant="ghost"
                    size="sm"
                    className="absolute right-1 top-1/2 transform -translate-y-1/2 h-8 w-8 p-0 hover:bg-transparent"
                    onClick={() => togglePasswordVisibility('current')}
                    disabled={isLoading}
                  >
                    {showPasswords.current ? (
                      <EyeOff className="h-4 w-4 text-muted-foreground" />
                    ) : (
                      <Eye className="h-4 w-4 text-muted-foreground" />
                    )}
                  </Button>
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="newPassword">New Password</Label>
                <div className="relative">
                  <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                  <Input
                    id="newPassword"
                    type={showPasswords.new ? 'text' : 'password'}
                    value={formData.newPassword}
                    onChange={(e) => handleInputChange('newPassword', e.target.value)}
                    placeholder="Enter new password"
                    disabled={isLoading}
                    className="h-11 pl-10 pr-10"
                  />
                  <Button
                    type="button"
                    variant="ghost"
                    size="sm"
                    className="absolute right-1 top-1/2 transform -translate-y-1/2 h-8 w-8 p-0 hover:bg-transparent"
                    onClick={() => togglePasswordVisibility('new')}
                    disabled={isLoading}
                  >
                    {showPasswords.new ? (
                      <EyeOff className="h-4 w-4 text-muted-foreground" />
                    ) : (
                      <Eye className="h-4 w-4 text-muted-foreground" />
                    )}
                  </Button>
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="confirmPassword">Confirm New Password</Label>
                <div className="relative">
                  <Shield className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                  <Input
                    id="confirmPassword"
                    type={showPasswords.confirm ? 'text' : 'password'}
                    value={formData.confirmPassword}
                    onChange={(e) => handleInputChange('confirmPassword', e.target.value)}
                    placeholder="Confirm new password"
                    disabled={isLoading}
                    className="h-11 pl-10 pr-10"
                  />
                  <Button
                    type="button"
                    variant="ghost"
                    size="sm"
                    className="absolute right-1 top-1/2 transform -translate-y-1/2 h-8 w-8 p-0 hover:bg-transparent"
                    onClick={() => togglePasswordVisibility('confirm')}
                    disabled={isLoading}
                  >
                    {showPasswords.confirm ? (
                      <EyeOff className="h-4 w-4 text-muted-foreground" />
                    ) : (
                      <Eye className="h-4 w-4 text-muted-foreground" />
                    )}
                  </Button>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="flex gap-3 pt-4">
          <Button variant="outline" onClick={handleCancel} disabled={isLoading} className="flex-1">
            Cancel
          </Button>
          <Button onClick={handleSave} disabled={isLoading} className="gap-2 flex-1">
            {isLoading ? (
              <>
                <div className="animate-spin rounded-full h-4 w-4 border-2 border-white border-t-transparent" />
                Saving...
              </>
            ) : (
              <>
                <Save className="h-4 w-4" />
                Save Changes
              </>
            )}
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}

export default ProfileForm;
