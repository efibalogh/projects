import { createContext, useContext, useState, ReactNode, useMemo, useEffect } from 'react';

import { authApi } from '../api/axios.config';
import { User } from '../types/user';
import { login as authLogin, logout as authLogout } from '../api/auth.api';
import { handleApiError } from '../utils/errorHandling';

type AuthContextType = {
  isAuthenticated: boolean;
  user: User | null;
  login: (username: string, password: string) => Promise<void>;
  logout: () => void;
  error: string | null;
};

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(!!localStorage.getItem('token'));
  const [user, setUser] = useState<User | null>(() => {
    const storedUser = localStorage.getItem('user');
    return storedUser ? JSON.parse(storedUser) : null;
  });
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!isAuthenticated) {
      return undefined;
    }

    const validateToken = async () => {
      try {
        const response = await authApi.get('/validate');
        const userData = response.data.user;
        if (userData) {
          setUser(userData);
          localStorage.setItem('user', JSON.stringify(userData));
        }
      } catch (err) {
        const errorResponse = handleApiError(err);
        setError(errorResponse.message);
        setUser(null);
        setIsAuthenticated(false);
        localStorage.removeItem('token');
        localStorage.removeItem('user');
        await authLogout();
      }
    };

    validateToken();

    const interval = setInterval(validateToken, 30000);

    return () => {
      clearInterval(interval);
    };
  }, [isAuthenticated]);

  const login = async (username: string, password: string) => {
    try {
      const response = await authLogin(username, password);
      const { token, user: userData } = response;

      if (!token) {
        throw new Error('No token received from server');
      }

      localStorage.setItem('token', token);
      if (userData) {
        localStorage.setItem('user', JSON.stringify(userData));
      }
      setIsAuthenticated(true);
      setUser(userData || null);
      setError(null);
    } catch (err) {
      const errorResponse = handleApiError(err);
      setError(errorResponse.message);
    }
  };

  const logout = async () => {
    try {
      await authLogout();
    } catch (err: unknown) {
      console.error('Error during logout:', err);
    } finally {
      localStorage.removeItem('token');
      localStorage.removeItem('user');
      setUser(null);
      setIsAuthenticated(false);
      window.location.href = '/auth/login';
    }
  };

  const value = useMemo(
    () => ({
      isAuthenticated,
      user,
      login,
      logout,
      error,
    }),
    [isAuthenticated, user, error],
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}
export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}
