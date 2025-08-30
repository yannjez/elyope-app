'use client';

import Sidemenu from './Sidemenu';
import { usePathname } from 'next/navigation';

const menuItems = [
  {
    href: '/login',
    label: 'Connexion',
  },
];

export default function SideLogin({
  languageSelector,
}: {
  languageSelector: React.ReactNode;
}) {
  const pathname = usePathname();
  return (
    <Sidemenu
      menuItems={menuItems.map((item) => ({
        ...item,
        isCurrent: pathname === item.href,
      }))}
      languageSelector={languageSelector}
    />
  );
}
