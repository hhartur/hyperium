'use client'

import { useI18n } from '@/hooks/useI18n';
import { Button } from '@/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';

const languageMap: { [key: string]: { label: string; flag: string } } = {
  en: { label: 'English', flag: '🇺🇸' },
  'pt-br': { label: 'Português', flag: '🇧🇷' },
  es: { label: 'Español', flag: '🇪🇸' },
};

export function LanguageSwitcher() {
  const { i18n, isInitialized } = useI18n();

  const changeLanguage = (lng: string) => {
    i18n.changeLanguage(lng);
  };

  if (!isInitialized) {
    return (
      <Button variant="ghost" className="flex items-center gap-2">
        <span>🇧🇷</span>
      </Button>
    )
  }

  const currentLanguage = languageMap[i18n.language.toLowerCase()] || languageMap['en'];

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="ghost" className="flex items-center gap-2">
          <span>{currentLanguage.flag}</span>
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent>
        {Object.keys(languageMap).map((lng) => (
          <DropdownMenuItem key={lng} onClick={() => changeLanguage(lng)}>
            <span className="mr-2">{languageMap[lng].flag}</span>
            {languageMap[lng].label}
          </DropdownMenuItem>
        ))}
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
