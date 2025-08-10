import { cn } from '../utils/cn';

type PanelTitleProps = React.HTMLAttributes<HTMLDivElement> & {
  title: string;
};

export function PanelTitle({ title, className, ...props }: PanelTitleProps) {
  return (
    <div
      className={cn('text-16 font-semibold text-el-grey-800 mb-4', className)}
      {...props}
    >
      {title}
    </div>
  );
}
