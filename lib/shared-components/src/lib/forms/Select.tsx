import CarretIcon from '../icons/Carret';
import { Option } from '../types/Base';
import { useState, useRef, useEffect } from 'react';
import { cn } from '../utils/cn';

type SelectProps = {
  options: Option[];
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
  disabled?: boolean;
  className?: string;
};

export default function Select({
  options,
  value,
  onChange,
  placeholder = 'Select an option',
  disabled = false,
  className = '',
  ...props
}: SelectProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [selectedOption, setSelectedOption] = useState<Option | null>(
    options.find((option) => option.value === value) || null
  );
  const selectRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const newSelectedOption = options.find((option) => option.value === value);
    setSelectedOption(newSelectedOption || null);
  }, [value, options]);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        selectRef.current &&
        !selectRef.current.contains(event.target as Node)
      ) {
        setIsOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  const handleOptionClick = (option: Option) => {
    setSelectedOption(option);
    onChange(option.value);
    setIsOpen(false);
  };

  const toggleDropdown = () => {
    if (!disabled) {
      setIsOpen(!isOpen);
    }
  };

  return (
    <div
      ref={selectRef}
      className={`relative min-w-40 ${className}`}
      {...props}
    >
      {/* Select Button */}
      <div
        onClick={toggleDropdown}
        className={`
          select     cursor-pointer flex items-center justify-between 
        
          ${isOpen ? 'border-gray-dark' : ''}
         
        `}
      >
        <span className={selectedOption ? 'text-gray-900' : 'text-gray-500'}>
          {selectedOption ? selectedOption.label : placeholder}
        </span>
        <span
          className={cn(
            'text-button-neutral-active transition-transform duration-300',
            isOpen ? 'rotate-180' : ''
          )}
        >
          <CarretIcon
            className={`transition-transform duration-300 ${
              isOpen ? 'rotate-180' : ''
            }`}
          />
        </span>
      </div>

      {/* Dropdown Options */}
      {isOpen && (
        <div className="absolute z-50 w-full mt-1  border border-gray2 rounded-4 max-h-60 overflow-auto bg-body-light">
          {options.map((option) => (
            <div
              key={option.value}
              onClick={() => handleOptionClick(option)}
              className={`
                px-2 py-1 cursor-pointer text-14 hover:bg-gray-hover whitespace-nowrap
                ${option.value === value ? 'bg-gray-hover text-gray-dark' : ''}
              `}
            >
              {option.label}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
