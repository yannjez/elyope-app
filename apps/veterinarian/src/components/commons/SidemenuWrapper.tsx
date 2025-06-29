'use client';

import { Sidemenu } from '@app-test2/shared-components';
import { useTranslations } from 'next-intl';
import ProfilButton from '../clerk/ProfilButton';
import { LanguageSwitch } from './LanguageSwitch';

export function SidemenuWrapper() {
  const t = useTranslations('Navigation');

  const menuItems = [
    { href: '/', label: t('home') },
    { href: '/examens', label: t('exams') },
    { href: '#', label: t('animals') },
    { href: '#', label: t('messages'), badge: 1 },
    { href: '/design', label: t('design') },
  ];

  return (
    <Sidemenu
      menuItems={menuItems}
      profileButton={<ProfilButton label={t('profile')} />}
      languageSelector={<LanguageSwitch />}
    />
  );
}
