import React from 'react';
import Button from '../forms/Button';
import { cn } from '../utils/cn';
import ArrowleftIcon from '../icons/ArrowLeft';

type MenuCardProps = {
  icon: React.ReactNode;
  title: string;
  description: string;
  action?: {
    text: string;
    onClick: () => void;
  };
  href: string;
  className?: string;
};

export function MenuCard({
  icon,
  title,
  description,
  action,
  href,
  className,
}: MenuCardProps) {
  return (
    <a
      href={href}
      className={cn(
        ' bg-body-light  group flex flex-col gap-2 rounded-4 p-5 min-w-[350px] h-[132px] hover:shadow-hover transition-all duration-600',
        className
      )}
    >
      <div className="flex justify-between items-start">
        <div className="flex items-center gap-4 ">
          {icon}
          <h3 className="text-34/[90%] font-bold ">{title}</h3>
        </div>
        <div className="text-gray-light group-hover:text-blue  ">
          <ArrowleftIcon className="transition-all duration-600" />
        </div>
      </div>
      <p className="  text-14 text-gray-dark">{description}</p>
      {action && (
        <div className="">
          <Button
            className="button-primary-inverse"
            onClick={(e) => {
              e.preventDefault();
              e.stopPropagation();
              action.onClick();
            }}
          >
            <span className="flex items-center gap-2">
              <span>+</span>
              <span>{action.text}</span>
            </span>
          </Button>
        </div>
      )}
    </a>
  );
}
