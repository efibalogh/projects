import { createContext, useContext, useState, ReactNode, useEffect, useMemo } from 'react';
import { useAuth } from './AuthContext';
import { useUserPreferences } from '../hooks/userHooks';

import i18n from '../services/i18n';

type LanguageContextType = {
  language: string;
  changeLanguage: (newLanguage: string) => Promise<void>;
  isUpdating: boolean;
};

const LanguageContext = createContext<LanguageContextType | undefined>(undefined);

export function LanguageProvider({ children }: { children: ReactNode }) {
  const [language, setLanguage] = useState<string>(localStorage.getItem('language') || 'en');
  const [isUpdating, setIsUpdating] = useState(false);
  const { isAuthenticated, user } = useAuth();
  const userPreferences = useUserPreferences(user?.id || 0);

  const changeLanguage = async (newLanguage: string) => {
    setIsUpdating(true);
    try {
      await i18n.changeLanguage(newLanguage);
      setLanguage(newLanguage);
      localStorage.setItem('language', newLanguage);
      console.log({ newLanguage });
      if (isAuthenticated && user) {
        await userPreferences.changeLanguage(newLanguage);
      }
    } catch (error) {
      console.error('Error changing language:', error);
      setLanguage(language);
      localStorage.setItem('language', language);
      await i18n.changeLanguage(language);
    } finally {
      setIsUpdating(false);
    }
  };

  useEffect(() => {
    if (user?.language && user.language !== language) {
      setLanguage(user.language);
      localStorage.setItem('language', user.language);
      i18n.changeLanguage(user.language);
    }
  }, [user]);

  const value = useMemo(() => ({ language, changeLanguage, isUpdating }), [language, isUpdating]);

  return <LanguageContext.Provider value={value}>{children}</LanguageContext.Provider>;
}

export const useLanguage = () => {
  const context = useContext(LanguageContext);
  if (!context) {
    throw new Error('useLanguage must be used within a LanguageProvider');
  }
  return context;
};
