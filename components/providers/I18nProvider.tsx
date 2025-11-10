'use client';

import { useEffect } from 'react';
import '../../i18n'; // Import i18n configuration

export function I18nProvider({ children }: { children: React.ReactNode }) {
  // You can add any client-side i18n logic here if needed
  // For now, just importing the i18n config is enough
  return <>{children}</>;
}
