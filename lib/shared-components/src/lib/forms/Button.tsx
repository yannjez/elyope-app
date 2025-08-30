import React from 'react';
import { cn } from '../utils/cn';

type ButtonProps = React.ButtonHTMLAttributes<HTMLButtonElement>;

function Button({ children, className, ...props }: ButtonProps) {
  return (
    <button
      className={cn(
        'button px-2 py-1 rounded-4 disabled:opacity-50 whitespace-nowrap',

        className
      )}
      {...props}
    >
      {children}
    </button>
  );
}

export default Button;
