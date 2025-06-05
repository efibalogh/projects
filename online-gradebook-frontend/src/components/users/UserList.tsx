import { useEffect, useState } from 'react';

import { Alert, AlertDescription } from '@/components/ui/alert';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { AlertTriangle, CheckCircle, Crown, GraduationCap, Search, Users } from 'lucide-react';

import { userApi } from '@/api/user.api';

import type { User } from '@/types/user';

import ErrorState from '@/components/common/ErrorState';
import LoadingState from '@/components/common/LoadingState';
import PageHeader from '@/components/layout/PageHeader';
import StatCard from '@/components/layout/StatCard';
import PromoteDialog from '@/components/users/PromoteDialog';

function UserList() {
  const [users, setUsers] = useState<User[]>([]);
  const [filteredUsers, setFilteredUsers] = useState<User[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);
  const [promotingUser, setPromotingUser] = useState<number | null>(null);

  useEffect(() => {
    fetchUsers();
  }, []);

  useEffect(() => {
    const filtered = users.filter(
      (user) =>
        user.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        user.email.toLowerCase().includes(searchQuery.toLowerCase()),
    );
    setFilteredUsers(filtered);
  }, [users, searchQuery]);

  useEffect(() => {
    if (success) {
      const timer = setTimeout(() => {
        setSuccess(null);
      }, 3000);
      return () => clearTimeout(timer);
    }
  }, [success]);

  const fetchUsers = async () => {
    setIsLoading(true);
    try {
      const data = await userApi.getUsers();
      setUsers(data.users);
      setError(null);
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to fetch users';
      setError(errorMessage);
    } finally {
      setIsLoading(false);
    }
  };

  const handlePromoteToTeacher = async (userId: number) => {
    setPromotingUser(userId);
    setError(null);
    setSuccess(null);

    try {
      const promotedUser = users.find((user) => user.id === userId);
      await userApi.updateRole(userId, 'teacher');
      setUsers((prevUsers) => prevUsers.map((user) => (user.id === userId ? { ...user, role: 'teacher' } : user)));
      setSuccess(
        `${promotedUser?.name} has been successfully promoted to Teacher. All course enrollments have been removed.`,
      );
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to promote user';
      setError(errorMessage);
    } finally {
      setPromotingUser(null);
    }
  };

  if (isLoading) {
    return (
      <LoadingState
        icon={<Users className="h-6 w-6" />}
        title="Loading users..."
        description="Please wait while we fetch the user list"
      />
    );
  }

  if (error && users.length === 0) {
    return <ErrorState title="Error loading users" message={error} actionLabel="Try Again" onAction={fetchUsers} />;
  }

  const studentCount = users.filter((user) => user.role === 'student').length;
  const teacherCount = users.filter((user) => user.role === 'teacher').length;

  return (
    <div className="container mx-auto p-6 space-y-8">
      <PageHeader title="User Management" description="Manage users and promote students to teachers" />

      {/* Search */}
      <div className="relative">
        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
        <Input
          placeholder="Search users by name or email..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="pl-10 h-11"
        />
      </div>

      {/* Statistics */}
      <div className="grid grid-cols-1 animate-fade-in sm:grid-cols-3 gap-4">
        <StatCard
          icon={<Users className="h-8 w-8" />}
          title="Total Users"
          value={users.length}
          borderColor="border-l-primary"
          iconColor="text-primary"
        />

        <StatCard
          icon={<GraduationCap className="h-8 w-8" />}
          title="Students"
          value={studentCount}
          borderColor="border-l-blue-500"
          iconColor="text-blue-500"
        />

        <StatCard
          icon={<Crown className="h-8 w-8" />}
          title="Teachers"
          value={teacherCount}
          borderColor="border-l-green-500"
          iconColor="text-green-500"
        />
      </div>

      {/* Success Message */}
      {success && (
        <Alert className="border-green-500/50 text-green-700 bg-green-50 dark:bg-green-950/20">
          <CheckCircle className="h-4 w-4" />
          <AlertDescription>{success}</AlertDescription>
        </Alert>
      )}

      {/* Error Banner */}
      {error && (
        <Alert className="border-destructive/50 text-destructive">
          <AlertTriangle className="h-4 w-4" />
          <AlertDescription>{error}</AlertDescription>
        </Alert>
      )}

      {/* Users List */}
      <Card>
        <CardContent>
          <div className="space-y-4">
            {filteredUsers.map((user) => (
              <div
                key={user.id}
                className="flex items-center justify-between p-4 border rounded-lg hover:bg-accent/50 transition-colors"
              >
                <div className="flex items-center space-x-4">
                  <div>
                    <h3 className="font-medium">{user.name}</h3>
                    <p className="text-sm text-muted-foreground">{user.email}</p>
                  </div>
                </div>

                <div className="flex items-center space-x-3">
                  {user.role === 'student' && (
                    <PromoteDialog
                      userName={user.name}
                      onPromote={() => handlePromoteToTeacher(user.id)}
                      isLoading={promotingUser === user.id}
                    />
                  )}
                  <Badge variant={user.role === 'teacher' ? 'default' : 'secondary'}>
                    {user.role === 'teacher' ? 'Teacher' : 'Student'}
                  </Badge>
                </div>
              </div>
            ))}

            {filteredUsers.length === 0 && !isLoading && (
              <div className="text-center py-8 text-muted-foreground">
                {searchQuery ? 'No users found matching your search.' : 'No users found.'}
              </div>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

export default UserList;
