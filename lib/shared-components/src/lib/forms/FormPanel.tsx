import { PanelTitle } from '../commons/PanelTitle';
import { cn } from '../utils/cn';

export type FormPanelProps = React.InputHTMLAttributes<HTMLDivElement> & {
  title: string;
  className?: string;
  children: React.ReactNode;
};

export function FormPanel({
  title,
  className,
  children,
  ...props
}: FormPanelProps) {
  return (
    <div className={cn('bg-white rounded-4 p-3', className)} {...props}>
      {title && <PanelTitle title={title} />}
      <div className="flex flex-col gap-2">{children}</div>
    </div>
  );
}
