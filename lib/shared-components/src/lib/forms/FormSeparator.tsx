import { cn } from '../utils/cn';

export function FormSeparator({
  className,
  ...props
}: React.HTMLAttributes<HTMLDivElement>) {
  return <div className={cn('h-[1px] bg-el-grey-200', className)} {...props} />;
}
