import { Navigate } from 'react-router-dom';

import { useAuth } from '../../context/AuthContext';

type AdminRouteProps = {
  children: React.ReactNode;
};

function AdminRoute({ children }: AdminRouteProps) {
  const { isAuthenticated, user } = useAuth();

  if (!isAuthenticated) {
    return <Navigate to="/auth/login" replace />;
  }

  if (user?.role !== 'ADMIN') {
    return <Navigate to="/events" replace />;
  }

  return <>{children}</>;
}

export default AdminRoute;
