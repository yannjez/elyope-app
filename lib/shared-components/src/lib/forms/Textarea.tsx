import { cn } from '../utils/cn';

type Props = React.TextareaHTMLAttributes<HTMLTextAreaElement> & {
  icon?: React.ReactNode;
  iconPosition?: 'left' | 'right';
  lines?: number; // Number of lines in height
};

export default function Textarea({
  className,
  icon,
  lines = 3,
  iconPosition = 'right',
  ...props
}: Props) {
  return (
    <div className={cn('relative', className)}>
      <textarea
        className={cn(
          'px-2 py-1 md:min-w-[400px] outline-none ring-0 text-12 w-full border border-el-grey-400 rounded-4 control resize-none',
          {
            'pl-8': icon && iconPosition === 'left',
            'pr-8': icon && iconPosition === 'right',
          }
        )}
        style={{ height: `${lines * 1.5 + 0.5}rem` }} // Approximate line height calculation
        {...props}
      />
      {icon && (
        <div
          className={cn('absolute top-2 text-el-grey-400', {
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
