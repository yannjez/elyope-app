'use client';

import { Sidemenu } from '@app-test2/shared-components';
import { useTranslations } from 'next-intl';

import { LanguageSwitch } from './LanguageSwitch';
import ProfilButton from '../clerk/ProfilButton';

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
      profileButton={<ProfilButton label={t('profile')} />}
      languageSelector={<LanguageSwitch />}
      qualifier="ADMIN"
    />
  );
}
