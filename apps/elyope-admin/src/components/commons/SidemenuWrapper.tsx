'use client';

import { Sidemenu } from '@app-test2/shared-components';
import { useTranslations } from 'next-intl';
import { ClerkProfilButton } from '@app-test2/shared-components';
import { LanguageSwitch } from './LanguageSwitch';

export function SidemenuWrapper() {
  const t = useTranslations('Navigation');

  const menuItems = [
    { href: '/', label: t('users') },
    { href: '/structures', label: t('structures') },
    { href: '/tools', label: t('tools') },
  ];

  return (
    <Sidemenu
      menuItems={menuItems}
      profileButton={<ClerkProfilButton label={t('profile')} />}
      languageSelector={<LanguageSwitch />}
    />
  );
}
