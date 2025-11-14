'use client'

import { useTranslation } from 'react-i18next';
import { useEffect, useState } from 'react';

export function useI18n() {
  const { t, i18n } = useTranslation('common');
  const [isInitialized, setIsInitialized] = useState(false);

  useEffect(() => {
    if (i18n.isInitialized) {
      setIsInitialized(true);
    } else {
      const handleInitialized = () => setIsInitialized(true);
      i18n.on('initialized', handleInitialized);
      return () => i18n.off('initialized', handleInitialized);
    }
  }, [i18n]);

  const safeT = (key: string, options?: any) => {
    if (!isInitialized) return key;
    const result = t(key, options);
    return typeof result === 'string' ? result : key;
  };

  return { t: safeT, i18n, isInitialized };
}
