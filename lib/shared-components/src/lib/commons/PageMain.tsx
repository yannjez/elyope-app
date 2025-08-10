import { cn } from '../utils/cn';

type PageMainProps = React.HTMLAttributes<HTMLDivElement> & {
  children: React.ReactNode;
};

export default function PageMain({
  children,
  className,
  ...props
}: PageMainProps) {
  return (
    <div className={cn('main-container p-3', className)} {...props}>
      {children}
    </div>
  );
}
