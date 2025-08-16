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
    { href: '/', label: t('users') },
    { href: '/structures', label: t('structures') },
    { href: '/tools', label: t('tools') },
  ];

  return (
    <Sidemenu
      menuItems={menuItems.map((item) => ({
        ...item,
        isCurrent:
          item.href === '/'
            ? (pathname === '/' || pathname?.startsWith('/user')) ?? false
            : pathname?.startsWith(item.href) ?? false,
      }))}
      profileButton={<ProfilButton label={t('profile')} />}
      languageSelector={<LanguageSwitch />}
      qualifier="ADMIN"
    />
  );
}
