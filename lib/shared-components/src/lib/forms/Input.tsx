import { cn } from '../utils/cn';

type Props = React.InputHTMLAttributes<HTMLInputElement> & {
  icon?: React.ReactNode;
  iconPosition?: 'left' | 'right';
  type?: 'text' | 'search' | 'tel' | 'email' | 'password' | 'date';
};

export default function Input({
  className,
  icon,
  type = 'text',
  iconPosition = 'right',
  ...props
}: Props) {
  return (
    <div className={cn('relative', className)}>
      <input
        type={type}
        className={cn(
          'px-2 py-1 md:min-w-[400px] outline-none ring-0 text-12 w-full border border-el-grey-400 rounded-4 control',
          {
            'pl-8': icon && iconPosition === 'left',
            'pr-8': icon && iconPosition === 'right',
          }
        )}
        {...props}
      />
      {icon && (
        <div
          className={cn('absolute top-1/2 -translate-y-1/2 text-el-grey-400 ', {
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
