'use client';

import { cn } from '../utils/cn';

type LanguageSwitcherProps = {
  languages: string[];
  currentLanguage: string;
  onLanguageChange: (language: string) => void;
  className?: string;
};

export const LanguageSwitcher = ({
  languages,
  currentLanguage,
  onLanguageChange,
  className,
}: LanguageSwitcherProps) => {
  return (
    <div
      className={cn(
        'flex rounded-full items-center bg-white gap-0 p-0',
        className
      )}
    >
      {languages.map((language, index) => (
        <button
          className={cn(
            'border-none grow py-1.5 px-2 cursor-pointer uppercase',
            index === 0 && 'rounded-l-full',
            index === languages.length - 1 && 'rounded-r-full',
            currentLanguage === language && 'bg-el-grey-200'
          )}
          key={language}
          onClick={() => onLanguageChange(language)}
        >
          {language}
        </button>
      ))}
    </div>
  );
};
