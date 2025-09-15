'use client';

import Link from 'next/link';
import { useState, useEffect, useCallback } from 'react';
import Logo from '../assets/Logo';
import { cn } from '../utils/cn';

type MenuItem = {
  href: string;
  label: string;
  badge?: number;
  icon?: React.ReactNode;
  isCurrent?: boolean;
};

type SidemenuProps = {
  className?: string;
  menuItems?: MenuItem[];
  languageSelector?: React.ReactNode;
  additionalElement?: React.ReactNode;
  footer?: {
    copyright: string;
    version: string;
  };
  profileButton?: React.ReactNode;
  qualifier?: string;
  onMobileMenuToggle?: (isOpen: boolean) => void;
};

function MenuLink({
  href,
  children,
  className,
  onClick,
}: {
  href: string;
  children: React.ReactNode;
  className?: string;
  onClick?: () => void;
}) {
  return (
    <Link
      href={href}
      onClick={onClick}
      className={cn(
        'py-3.5 px-4 rounded-[44px] w-auto inline  hover:bg-white items-center gap-2 transition-all duration-300 hover:shadow-hover ',
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
  additionalElement,
  profileButton,
  qualifier = 'APP',
  onMobileMenuToggle,
}: SidemenuProps) {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const toggleMobileMenu = () => {
    const newState = !isMobileMenuOpen;
    setIsMobileMenuOpen(newState);
    onMobileMenuToggle?.(newState);
  };

  const closeMobileMenu = useCallback(() => {
    setIsMobileMenuOpen(false);
    onMobileMenuToggle?.(false);
  }, [onMobileMenuToggle]);

  // Close mobile menu on window resize if screen becomes desktop size
  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth >= 768 && isMobileMenuOpen) {
        closeMobileMenu();
      }
    };

    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, [isMobileMenuOpen, closeMobileMenu]);

  return (
    <>
      {/* Mobile Menu Button - Only visible on mobile */}
      <div className="lg:hidden  flex gap-2 py-2 px-3 bg-white backdrop-blur-sm  items-center justify-between fixed  w-full  z-50 ">
        <button
          onClick={toggleMobileMenu}
          className=" p-2 bg-el-grey-100 rounded-4 "
          aria-label="Toggle mobile menu"
        >
          <svg
            width="24"
            height="24"
            viewBox="0 0 24 24"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              d="M3 12h18M3 6h18M3 18h18"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>
        </button>
        <div className="flex items-start justify-center gap-2">
          <Logo className="w-full" />
          <div className="bg-el-blue-500 rounded-[33px] text-[12px] tracking-[0] text-white px-[4.5px] py-[3px]">
            {qualifier}
          </div>
        </div>
      </div>

      {/* Backdrop - Only visible on mobile when menu is open */}
      {isMobileMenuOpen && (
        <div
          className="lg:hidden fixed inset-0 bg-black bg-opacity-50 z-40"
          onClick={closeMobileMenu}
        />
      )}

      {/* Sidemenu */}
      <div
        className={cn(
          'max-h-screen bg-el-grey-100 transition-all duration-300 min-h-screen py-5 px-3 flex flex-col gap-5',
          // Desktop styles
          'lg:sticky lg:top-0 lg:min-w-[230px]',
          // Mobile styles - z-50 to be above backdrop (z-40)
          'fixed inset-y-0 left-0 z-50  w-full lg:w-[280px]  lg:w-auto',
          // Mobile menu visibility
          isMobileMenuOpen
            ? 'translate-x-0'
            : '-translate-x-full lg:translate-x-0',
          className
        )}
      >
        {/* Mobile Close Button */}
        <button
          onClick={closeMobileMenu}
          className="lg:hidden absolute top-4 right-4 p-1 text-el-grey-600 hover:text-el-grey-800 transition-colors"
          aria-label="Close mobile menu"
        >
          <svg
            width="24"
            height="24"
            viewBox="0 0 24 24"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              d="M18 6L6 18M6 6l12 12"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>
        </button>

        <div className="flex flex-col gap-5 md:mt-8 lg:mt-0">
          <div className="min-h-10 flex flex-col gap-2">
            <div className="flex md:items-start md:justify-center gap-2">
              <Logo className="md:w-full" />
              <div className="bg-el-blue-500 rounded-[33px] text-[12px] tracking-[0] text-white px-[4.5px] py-[3px]">
                {qualifier}
              </div>
            </div>
            <hr className="w-full border-el-grey-300 mt-6 mb-0" />
          </div>
          <nav className="flex flex-col gap-2">
            {menuItems?.map((item, index) => (
              <MenuLink
                key={index}
                href={item.href}
                className={cn(item.isCurrent && 'bg-white')}
                onClick={closeMobileMenu}
              >
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
        <div className="flex gap-2 justify-between mt-auto items-center">
          {additionalElement}
        </div>
        <div className="flex gap-2 justify-between  items-center">
          {profileButton}
          {languageSelector}
        </div>
        <div className="text-10 text-el-grey-500 flex gap-1 justify-between border-t border-el-grey-300 pt-2">
          <span>{footer.copyright}</span>
          <span>{footer.version}</span>
        </div>
      </div>
    </>
  );
}
