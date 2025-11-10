'use client';

import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';
import LanguageDetector from 'i18next-browser-languagedetector';

import enTranslation from './locales/en/common.json';
import ptBrTranslation from './locales/pt-br/common.json';
import esTranslation from './locales/es/common.json';

i18n
  .use(LanguageDetector)
  .use(initReactI18next)
  .init({
    resources: {
      en: {
        common: enTranslation,
      },
      'pt-br': {
        common: ptBrTranslation,
      },
      es: {
        common: esTranslation,
      },
    },
    fallbackLng: 'en',
    debug: true,
    ns: ['common'],
    defaultNS: 'common',
    interpolation: {
      escapeValue: false,
    },
    detection: {
      order: ['localStorage', 'cookie', 'navigator'],
      caches: ['localStorage', 'cookie'],
      lookupLocalStorage: 'i18nextLng',
      lookupCookie: 'i18next',
      convertDetectedLanguage: (lng) => {
        if (lng.toLowerCase() === 'pt') return 'pt-br';
        return lng;
      },
    },
  });

export default i18n;