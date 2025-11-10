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

  return { t: isInitialized ? t : (key: string) => key, i18n, isInitialized };
}
