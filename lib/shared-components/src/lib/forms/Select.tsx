import { Option } from '../types/Base';

type SelectProps = React.SelectHTMLAttributes<HTMLSelectElement> & {
  options: Option[];
  value: string;
  onChange: (value: string) => void;
};

export default function Select({
  options,
  value,
  onChange,
  ...props
}: SelectProps) {
  return (
    <select
      {...props}
      className="select  outline-none ring-0 border-body rounded-4 py-1 px-2 text-14 control "
      value={value}
      onChange={(e) => onChange(e.target.value)}
      style={{
        backgroundImage: 'none',
      }}
    >
      {options.map((option) => (
        <option key={option.value} value={option.value}>
          {option.label}
        </option>
      ))}
    </select>
  );
}
