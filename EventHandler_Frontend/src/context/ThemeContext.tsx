import { createContext, useContext, useEffect, useMemo, useState, ReactNode } from 'react';
import { ThemeProvider as MuiThemeProvider } from '@mui/material/styles';
import CssBaseline from '@mui/material/CssBaseline';

import { useAuth } from './AuthContext';
import { themeOptions, ThemeKey } from '../themes/theme';
import { useUserPreferences } from '../hooks/userHooks';

type ThemeContextType = {
  currentTheme: ThemeKey;
  setTheme: (theme: ThemeKey) => void;
};

const ThemeContext = createContext<ThemeContextType | undefined>(undefined);

type ThemeProviderProps = {
  children: ReactNode;
};

export function ThemeProvider({ children }: ThemeProviderProps) {
  const [currentTheme, setCurrentTheme] = useState<ThemeKey>(() => {
    const savedTheme = localStorage.getItem('theme') as ThemeKey;
    return savedTheme || 'light';
  });

  const [isUpdating, setIsUpdating] = useState(false);
  const { isAuthenticated, user } = useAuth();
  const userPreferences = useUserPreferences(user?.id || 0);

  const changeTheme = async (newTheme: ThemeKey) => {
    setIsUpdating(true);
    try {
      setCurrentTheme(newTheme);
      localStorage.setItem('theme', newTheme);
      console.log({ newTheme });
      if (isAuthenticated && user) {
        await userPreferences.changeTheme(newTheme);
      }
    } catch (error) {
      console.error('Error changing theme:', error);
      setCurrentTheme(currentTheme);
      localStorage.setItem('theme', currentTheme);
    } finally {
      setIsUpdating(false);
    }
  };

  useEffect(() => {
    if (user?.theme && user.theme !== currentTheme) {
      setCurrentTheme(user.theme as ThemeKey);
      localStorage.setItem('theme', user.theme);
    }
  }, [user]);

  const theme = useMemo(() => themeOptions[currentTheme].theme, [currentTheme]);

  const value = useMemo(
    () => ({
      currentTheme,
      setTheme: changeTheme,
      isUpdating,
    }),
    [currentTheme, isUpdating],
  );

  return (
    <ThemeContext.Provider value={value}>
      <MuiThemeProvider theme={theme}>
        <CssBaseline />
        {children}
      </MuiThemeProvider>
    </ThemeContext.Provider>
  );
}

export const useTheme = (): ThemeContextType => {
  const context = useContext(ThemeContext);
  if (context === undefined) {
    throw new Error('useTheme must be used within a ThemeProvider');
  }
  return context;
};
