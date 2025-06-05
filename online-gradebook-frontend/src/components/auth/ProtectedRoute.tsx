import { Navigate } from 'react-router-dom';

import { useAuth } from '@/hooks/auth';

function ProtectedRoute({ children }: { children: React.ReactNode }) {
  const { isAuthenticated, isLoading } = useAuth();

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

  return <>{children}</>;
}

export default ProtectedRoute;
