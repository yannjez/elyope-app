import CarretIcon from '../icons/Carret';
import { Option } from '../types/Base';
import { useState, useRef, useEffect, useMemo } from 'react';
import { cn } from '../utils/cn';

type SelectProps = {
  options: Option[];
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
  disabled?: boolean;
  className?: string;
  'aria-label'?: string;
  'aria-describedby'?: string;
};

export default function Select({
  options,
  value,
  onChange,
  placeholder = 'Select an option',
  disabled = false,
  className = '',
  'aria-label': ariaLabel,
  'aria-describedby': ariaDescribedby,
  ...props
}: SelectProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [selectedOption, setSelectedOption] = useState<Option | null>(
    options.find((option) => option.value === value) || null
  );
  const selectRef = useRef<HTMLDivElement>(null);
  const buttonRef = useRef<HTMLDivElement>(null);
  const listboxRef = useRef<HTMLDivElement>(null);

  // Generate unique ID for this select instance
  const uniqueId = useMemo(() => {
    return `select-listbox-${Date.now()}-${Math.random()
      .toString(36)
      .substring(2, 9)}`;
  }, []);

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

  const handleKeyDown = (event: React.KeyboardEvent) => {
    if (disabled) return;

    switch (event.key) {
      case 'Enter':
      case ' ':
        event.preventDefault();
        toggleDropdown();
        break;
      case 'Escape':
        setIsOpen(false);
        break;
      case 'ArrowDown':
        event.preventDefault();
        if (!isOpen) {
          setIsOpen(true);
        }
        break;
      case 'ArrowUp':
        event.preventDefault();
        if (!isOpen) {
          setIsOpen(true);
        }
        break;
    }
  };

  return (
    <div
      ref={selectRef}
      className={`relative min-w-40 ${className} border border-el-grey-400 rounded-4`}
      {...props}
    >
      {/* Select Button */}
      <div
        ref={buttonRef}
        role="combobox"
        aria-expanded={isOpen}
        aria-haspopup="listbox"
        aria-controls={isOpen ? uniqueId : undefined}
        aria-label={ariaLabel || 'Select an option'}
        aria-describedby={ariaDescribedby}
        aria-disabled={disabled}
        tabIndex={disabled ? -1 : 0}
        onClick={toggleDropdown}
        onKeyDown={handleKeyDown}
        className={`
          select cursor-pointer flex items-center justify-between 
          [&[aria-expanded="true"]]:border-el-grey-800
        `}
      >
        <span
          className={selectedOption ? 'text-el-grey-800' : 'text-el-grey-500'}
        >
          {selectedOption ? selectedOption.label : placeholder}
        </span>
        <span
          className={cn(
            'text-button-neutral-active transition-transform duration-300',
            '[&[aria-expanded="true"]]:rotate-180'
          )}
        >
          <CarretIcon
            className={`transition-transform duration-300 [&[aria-expanded="true"]]:rotate-180`}
          />
        </span>
      </div>

      {/* Dropdown Options */}
      {isOpen && (
        <div
          ref={listboxRef}
          id={uniqueId}
          role="listbox"
          aria-label="Available options"
          className="min-h-10 absolute z-50 w-full mt-1 border border-el-grey-600 rounded-4 max-h-60 overflow-auto bg-el-grey-100"
        >
          {options.map((option) => (
            <div
              key={option.value}
              role="option"
              aria-selected={option.value === value}
              onClick={() => handleOptionClick(option)}
              className={`
                px-2 py-1 cursor-pointer text-14 whitespace-nowrap
                ${
                  option.value === value
                    ? 'bg-el-grey-200'
                    : 'bg-el-grey-100 hover:bg-el-grey-200 transition-all duration-300'
                }
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
