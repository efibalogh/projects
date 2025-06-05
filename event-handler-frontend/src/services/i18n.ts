import { initReactI18next } from 'react-i18next';
import i18n from 'i18next';
import i18nBackend from 'i18next-http-backend';

export const supportedLngs = ['en', 'hu', 'ro'] as const;

i18n
  .use(initReactI18next)
  .use(i18nBackend)
  .init({
    lng: localStorage.getItem('language') || 'en',
    fallbackLng: 'en',
    supportedLngs,
    interpolation: {
      escapeValue: false,
    },
    backend: {
      loadPath: '/locales/{{lng}}.json',
    },
  });

export default i18n;
