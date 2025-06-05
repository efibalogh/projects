import { Navigate, useNavigate } from 'react-router-dom';

import { useAuth } from '@/hooks/auth';

import ErrorState from '@/components/common/ErrorState';

function TeacherRoute({ children }: { children: React.ReactNode }) {
  const { isAuthenticated, isLoading, user } = useAuth();
  const navigate = useNavigate();

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <p>Loading...</p>
      </div>
    );
  }

  if (!isAuthenticated) {
    return <Navigate to="/auth/login" replace />;
  }

  if (user?.role !== 'teacher') {
    return (
      <ErrorState
        title="Access Denied"
        message="This page is only accessible to teachers."
        actionLabel="Go to Home"
        onAction={() => navigate('/')}
      />
    );
  }

  return <>{children}</>;
}

export default TeacherRoute;
