import { Navigate } from 'react-router-dom';

import { useAuth } from '../../context/AuthContext';

type ProtectedRouteProps = {
  children: React.ReactNode;
};

function ProtectedRoute({ children }: ProtectedRouteProps) {
  const { isAuthenticated } = useAuth();

  if (!isAuthenticated) {
    return <Navigate to="/auth/login" replace />;
  }
  console.log('isAuthenticated', isAuthenticated);
  return <>{children}</>;
}

export default ProtectedRoute;
