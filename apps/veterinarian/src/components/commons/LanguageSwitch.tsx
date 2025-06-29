'use client';

import { LanguageSwitcher } from '@app-test2/shared-components';
import { useLocale } from 'next-intl';
import { useRouter } from 'next/navigation';

export const LanguageSwitch = () => {
  const router = useRouter();
  const locale = useLocale();

  const handleLanguageChange = async (language: string) => {
    //Cookie js
    document.cookie = `NEXT_LOCALE=${language}; path=/`;
    router.refresh();
  };

  return (
    <>
      <LanguageSwitcher
        languages={['fr', 'en']}
        currentLanguage={locale}
        onLanguageChange={handleLanguageChange}
      />
    </>
  );
};
