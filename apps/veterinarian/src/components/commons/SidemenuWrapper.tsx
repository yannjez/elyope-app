'use client';

import { Sidemenu } from '@app-test2/shared-components';
import { useTranslations } from 'next-intl';
import { usePathname } from 'next/navigation';

import { LanguageSwitch } from './LanguageSwitch';
import ProfilButton from '../clerk/ProfilButton';

export function SidemenuWrapper() {
  const t = useTranslations('Navigation');
  const pathname = usePathname();

  const menuItems = [
    { href: '/', label: t('home') },
    { href: '/examens', label: t('exams') },
    { href: '#', label: t('animals') },
    { href: '#', label: t('messages'), badge: 1 },
    { href: '/design', label: t('design') },
  ];

  return (
    <Sidemenu
      menuItems={menuItems.map((item) => ({
        ...item,
        isCurrent:
          item.href === '/'
            ? pathname === '/'
            : pathname?.startsWith(item.href) ?? false,
      }))}
      profileButton={<ProfilButton label={t('profile')} />}
      languageSelector={<LanguageSwitch />}
    />
  );
}
