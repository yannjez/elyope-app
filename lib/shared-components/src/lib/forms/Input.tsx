import { cn } from '../utils/cn';

type Props = React.InputHTMLAttributes<HTMLInputElement> & {
  icon?: React.ReactNode;
  iconPosition?: 'left' | 'right';
};

export default function Input({
  className,
  icon,
  iconPosition = 'right',
  ...props
}: Props) {
  return (
    <div className={cn('relative', className)}>
      <input
        type="text"
        id="input"
        className={cn(
          'px-2 py-1 outline-none ring-0 text-14 w-full border border-body rounded-4 control',
          {
            'pl-8': icon && iconPosition === 'left',
            'pr-8': icon && iconPosition === 'right',
          }
        )}
        {...props}
      />
      {icon && (
        <div
          className={cn('absolute top-1/2 -translate-y-1/2 text-body ', {
            'left-2': iconPosition === 'left',
            'right-2': iconPosition === 'right',
          })}
        >
          {icon}
        </div>
      )}
    </div>
  );
}
