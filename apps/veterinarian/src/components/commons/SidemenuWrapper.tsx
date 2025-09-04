'use client';

import { Sidemenu, BriefCaseIcon, cn } from '@app-test2/shared-components';
import { useTranslations } from 'next-intl';
import { usePathname } from 'next/navigation';
import { useState, useRef, useEffect } from 'react';

import { LanguageSwitch } from './LanguageSwitch';
import ProfilButton from '../clerk/ProfilButton';
import { useAppContext } from '../layouts/AppContext';

export function SidemenuWrapper() {
  const t = useTranslations('Navigation');
  const pathname = usePathname();
  const { currentStructure, structures, handleStructureChange } =
    useAppContext();

  const [isPopoverOpen, setIsPopoverOpen] = useState(false);
  const popoverRef = useRef<HTMLDivElement>(null);

  // Handle clicking outside to close popover
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        popoverRef.current &&
        !popoverRef.current.contains(event.target as Node)
      ) {
        setIsPopoverOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  const handleStructureSelect = (structureId: string) => {
    handleStructureChange(structureId);
    setIsPopoverOpen(false);
  };

  const menuItems = [
    { href: `/${currentStructure?.id}`, label: t('home') },
    { href: `/${currentStructure?.id}/exams`, label: t('exams') },
    { href: `/${currentStructure?.id}/animals`, label: t('animals') },
    { href: '#', label: t('messages'), badge: 1 },
  ];

  const structureElement = (
    <div ref={popoverRef} className="relative w-full">
      {/* Structure Button - styled like menu links */}
      <button
        onClick={() => setIsPopoverOpen(!isPopoverOpen)}
        title={currentStructure?.name + ' - ' + currentStructure?.town}
        className="hover:!bg-el-blue-200 py-3.5 px-4 cursor-pointer rounded-[44px] w-full bg-white items-center gap-2 transition-all duration-300 hover:shadow-hover text-left flex"
      >
        <span className="flex items-center gap-2 w-full">
          <BriefCaseIcon />
          <span className="flex-1 truncate">{t('myStructure')}</span>
        </span>
      </button>

      {/* Structure Popover */}
      {isPopoverOpen && (
        <div
          className={cn(
            'absolute -top-60 left-0 right-0  mt-1 bg-white  overflow-y-auto rounded-4 shadow-lg z-50 max-h-50 overflow-auto',
            structures?.length > 1 ? '-top-54' : '-top-28'
          )}
        >
          {/* Current Structure Info */}
          <div className="px-4 py-3 bg-el-grey-50 border-b border-el-grey-200">
            <div className="font-semibold text-14 text-el-grey-800 mb-1">
              Current Structure
            </div>
            <div className=" text-12 text-el-grey-700">
              {currentStructure?.name}
            </div>
            <div className="text-12 text-el-grey-500">
              {currentStructure?.zipcode} {currentStructure?.town}
            </div>
          </div>

          {/* Available Structures */}
          {structures.length > 1 && (
            <div className="py-2">
              <div className="px-4 py-2 text-12 font-medium text-el-grey-600 uppercase tracking-wide">
                Switch to:
              </div>
              {structures
                .filter((structure) => structure.id !== currentStructure?.id)
                .map((structure) => (
                  <div
                    key={structure.id}
                    onClick={() => handleStructureSelect(structure.id)}
                    className="px-4 py-2 cursor-pointer text-14 hover:bg-el-blue-200 transition-colors"
                  >
                    <div className=" text-12 text-el-grey-700">
                      {structure.name}
                    </div>
                    <div className="text-12 text-el-grey-500">
                      {structure.zipcode} {structure.town}
                    </div>
                  </div>
                ))}
              {structures
                .filter((structure) => structure.id !== currentStructure?.id)
                .map((structure) => (
                  <div
                    key={structure.id}
                    onClick={() => handleStructureSelect(structure.id)}
                    className="px-4 py-2 cursor-pointer text-14 hover:bg-el-blue-200 transition-colors"
                  >
                    <div className=" text-12 text-el-grey-700">
                      {structure.name}
                    </div>
                    <div className="text-12 text-el-grey-500">
                      {structure.zipcode} {structure.town}
                    </div>
                  </div>
                ))}
              {structures
                .filter((structure) => structure.id !== currentStructure?.id)
                .map((structure) => (
                  <div
                    key={structure.id}
                    onClick={() => handleStructureSelect(structure.id)}
                    className="px-4 py-2 cursor-pointer text-14 hover:bg-el-blue-200 transition-colors"
                  >
                    <div className=" text-12 text-el-grey-700">
                      {structure.name}
                    </div>
                    <div className="text-12 text-el-grey-500">
                      {structure.zipcode} {structure.town}
                    </div>
                  </div>
                ))}
            </div>
          )}
        </div>
      )}
    </div>
  );

  return (
    <Sidemenu
      menuItems={menuItems.map((item) => ({
        ...item,
        isCurrent:
          item.href === `/${currentStructure?.id}`
            ? pathname === `/${currentStructure?.id}`
            : pathname?.startsWith(item.href) ?? false,
      }))}
      profileButton={
        <ProfilButton
          label={t('profile')}
          structureId={currentStructure?.id || ''}
        />
      }
      languageSelector={<LanguageSwitch />}
      additionalElement={structureElement}
    />
  );
}
