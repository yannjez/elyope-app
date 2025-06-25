type PageHeaderProps = {
  icon?: React.ReactNode;
  title: string;
  filters?: React.ReactNode;
  action?: React.ReactNode;
};

export default function PageHeader({
  icon,
  title,
  filters,
  action,
}: PageHeaderProps) {
  return (
    <div className="bg-el-grey-100 rounded-4 p-3 flex flex-col content-center justify-center gap-2 min-h-15 w-full mb-1 ">
      <div className="flex  justify-between items-center ">
        <h1 className="flex items-center gap-1">
          <span className="text-el-blue-500 w-4.5 h-auto">{icon && icon}</span>
          <span className="text-24/[90%] font-bold ">{title}</span>
        </h1>
        {action && <div> {action}</div>}
      </div>
      {filters && (
        <div className="flex justify-between items-center">{filters}</div>
      )}
    </div>
  );
}
