'use client';

import Link from 'next/link';
import Logo from '../assets/Logo';
import { cn } from '../utils/cn';

type MenuItem = {
  href: string;
  label: string;
  badge?: number;
  icon?: React.ReactNode;
};

type SidemenuProps = {
  className?: string;
  menuItems?: MenuItem[];
  languageSelector?: React.ReactNode;
  footer?: {
    copyright: string;
    version: string;
  };
  profileButton?: React.ReactNode;
};

function MenuLink({
  href,
  children,
  className,
}: {
  href: string;
  children: React.ReactNode;
  className?: string;
}) {
  return (
    <Link
      href={href}
      className={cn(
        'py-3.5 px-4 rounded-[44px] w-auto inline  hover:bg-white items-center gap-2 transition-all duration-300 hover:shadow-hover',
        className
      )}
    >
      {children}
    </Link>
  );
}

export default function Sidemenu({
  className,
  menuItems,
  languageSelector,
  footer = {
    copyright: `©${new Date().getFullYear()} Elyope`,
    version: 'Elyope App V1.0.0',
  },
  profileButton,
}: SidemenuProps) {
  return (
    <div
      className={cn(
        'bg-el-grey-100 transition-all duration-300 sticky top-0 min-h-screen min-w-[230px] py-5 px-3 flex flex-col gap-5',
        className
      )}
    >
      <div className="flex  flex-col  gap-5">
        <div className="min-h-10 flex flex-col gap-2">
          <div className="flex items-start justify-center gap-0">
            <Logo className="w-full" />
            <div className="bg-el-blue-500 rounded-[33px] text-[9px] tracking-[0] text-white px-[4.5px] py-[3px]">
              APP
            </div>
          </div>
          <hr className="mt-auto w-full border-el-grey-300" />
        </div>
        <nav className="flex flex-col gap-2">
          {menuItems?.map((item, index) => (
            <MenuLink key={index} href={item.href}>
              <span className="flex items-center gap-2">
                {item.icon && <span>{item.icon}</span>}
                <span>{item.label}</span>
                {item.badge && (
                  <span className="bg-el-orange-800 flex items-center justify-center rounded-full w-4 h-4 text-10 text-white font-medium">
                    {item.badge}
                  </span>
                )}
              </span>
            </MenuLink>
          ))}
        </nav>
      </div>
      <div className="flex  gap-2 justify-between mt-auto items-center">
        {profileButton}
        {languageSelector}
      </div>
      <div className="text-10 text-el-grey-500 flex gap-1 justify-between border-t border-el-grey-300 pt-2 ">
        <span>{footer.copyright}</span>
        <span>{footer.version}</span>
      </div>
    </div>
  );
}
