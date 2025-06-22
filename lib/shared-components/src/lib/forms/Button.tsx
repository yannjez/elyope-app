import React from 'react';
import { cn } from '../utils/cn';

type ButtonProps = React.ButtonHTMLAttributes<HTMLButtonElement> & {
  variant?: 'neutral' | 'primary' | 'destructive';
};

function Button({
  children,
  className,
  variant = 'neutral',
  ...props
}: ButtonProps) {
  return (
    <button className={cn(`button-${variant}`, className)} {...props}>
      {children}
    </button>
  );
}

export default Button;
