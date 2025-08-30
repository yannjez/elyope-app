import React from 'react';

type Props = React.SVGProps<SVGSVGElement> & {
  className?: string;
};

export default function CarretLeftIcon({ className, ...props }: Props) {
  return (
    <svg
      width="8"
      height="12"
      viewBox="0 0 8 12"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      {...props}
      className={className}
    >
      <path
        d="M6.5 1L1.5 6L6.5 11"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}
