import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

import { useAuth } from '../../context/AuthContext';
import GenericDetails from '../common/GenericDetails';

function Logout() {
  const { logout } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    const performLogout = () => {
      logout();
    };

    performLogout();
  }, [logout, navigate]);

  return <GenericDetails title="Logging out..." isLoading fields={[]} />;
}

export default Logout;
