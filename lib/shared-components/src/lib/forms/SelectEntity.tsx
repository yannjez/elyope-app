'use client';

import { useEffect, useMemo, useRef, useState } from 'react';
import { cn } from '../utils/cn';
import SearchIcon from '../icons/search';
import { BaseEntity } from '../types/Base';

export type SelectEntityServices<T extends BaseEntity> = {
  // Fetch initial/linked entities (shown when opening with empty input). Should return up to 5 items.
  loadInitial: () => Promise<T[]>;
  // Search entities when typing. Should return a reasonably small list (we will cap display to 5).
  search: (query: string) => Promise<T[]>;
};

export type SelectEntityExtractors<T> = {
  getItemId?: (item: T) => string;
  getItemLabel?: (item: T) => string;
  renderItem?: (item: T, isSelected: boolean) => React.ReactNode;
  renderValue?: (item: T) => string; // string to show in the input when selected
  getFormValue?: (item: T | null) => string; // hidden input value
};

export type SelectEntityA11y = {
  placeholder?: string;
  disabled?: boolean;
  className?: string;
  name?: string; // hidden input name
  'aria-label'?: string;
  'aria-describedby'?: string;
};

export type SelectEntityProps<T extends BaseEntity> = {
  value: T | null;
  onChange: (value: T | null) => void;
} & SelectEntityServices<T> &
  SelectEntityExtractors<T> &
  SelectEntityA11y;

export default function SelectEntity<T extends BaseEntity>(
  props: SelectEntityProps<T>
) {
  const {
    value,
    onChange,
    loadInitial,
    search,
    getItemId: getItemIdProp,
    getItemLabel: getItemLabelProp,
    renderItem,
    renderValue,
    placeholder = 'Select an entity…',
    disabled = false,
    className,
    name,
    getFormValue,
    'aria-label': ariaLabel,
    'aria-describedby': ariaDescribedby,
  } = props;

  const containerRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  const [isOpen, setIsOpen] = useState(false);
  const [inputValue, setInputValue] = useState<string>('');
  const [items, setItems] = useState<T[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [highlightIndex, setHighlightIndex] = useState<number>(-1);

  function dedupeById(itemsToDedupe: T[], getId?: (item: T) => string): T[] {
    const seen = new Set<string>();
    const result: T[] = [];
    for (const item of itemsToDedupe) {
      const id = (getId && getId(item)) || '';
      if (!seen.has(id)) {
        seen.add(id);
        result.push(item);
      }
    }
    return result;
  }

  const computeFormValue = useMemo<
    ((item: T | null) => string) | undefined
  >(() => {
    if (!name) return undefined;
    if (getFormValue) return getFormValue;
    return (item: T | null) =>
      item && getItemIdProp ? getItemIdProp(item) : '';
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [name]);

  // Sync displayed text with selected value
  useEffect(() => {
    if (value) {
      const label =
        (renderValue
          ? renderValue(value)
          : getItemLabelProp && getItemLabelProp(value)) || '';
      setInputValue(label);
    } else if (!isOpen) {
      setInputValue('');
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [value]);

  // Close on outside click
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (!containerRef.current) return;
      if (!containerRef.current.contains(event.target as Node)) {
        setIsOpen(false);
        // If inputValue doesn't match selected label, keep user-typed text; do not revert here
      }
    }
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  // Fetch initial when opened with empty query
  useEffect(() => {
    let isCancelled = false;
    async function fetchInitial() {
      if (!isOpen) return;
      if (inputValue.trim() !== '') return;
      setIsLoading(true);
      try {
        const data = await loadInitial();
        const unique = dedupeById(data || [], getItemIdProp).slice(0, 5);
        if (!isCancelled) setItems(unique);
      } finally {
        if (!isCancelled) setIsLoading(false);
      }
    }
    fetchInitial();
    return () => {
      isCancelled = true;
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isOpen, inputValue]);

  // Debounced search when typing
  useEffect(() => {
    let isCancelled = false;
    if (!isOpen) return;

    const keyword = inputValue.trim();
    if (keyword === '') return; // initial loader handles empty

    setIsLoading(true);
    const handle = setTimeout(async () => {
      try {
        const data = await search(keyword);
        const unique = dedupeById(data || [], getItemIdProp).slice(0, 5);
        if (!isCancelled) {
          setItems(unique);
          setHighlightIndex((idx) =>
            idx >= 0 && idx < Math.min(5, unique.length) ? idx : -1
          );
        }
      } finally {
        if (!isCancelled) setIsLoading(false);
      }
    }, 300);

    return () => {
      isCancelled = true;
      clearTimeout(handle);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [inputValue, isOpen]);

  const handleInputFocus = () => {
    if (disabled) return;
    setIsOpen(true);
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const text = e.target.value;
    setInputValue(text);
    if (!isOpen) setIsOpen(true);
  };

  const handleSelect = (item: T) => {
    onChange(item);
    const label =
      (renderValue
        ? renderValue(item)
        : getItemLabelProp && getItemLabelProp(item)) || '';
    setInputValue(label);
    setIsOpen(false);
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (!isOpen) return;
    if (items.length === 0) return;
    if (e.key === 'ArrowDown') {
      e.preventDefault();
      setHighlightIndex((prev) => {
        const next = prev + 1;
        return next >= Math.min(5, items.length) ? 0 : next;
      });
    } else if (e.key === 'ArrowUp') {
      e.preventDefault();
      setHighlightIndex((prev) => {
        const next = prev - 1;
        return next < 0 ? Math.min(5, items.length) - 1 : next;
      });
    } else if (e.key === 'Enter') {
      e.preventDefault();
      const idx = highlightIndex >= 0 ? highlightIndex : 0;
      const item = items[idx];
      if (item) handleSelect(item);
    } else if (e.key === 'Escape') {
      setIsOpen(false);
    }
  };

  const renderedItems = useMemo(() => items.slice(0, 5), [items]);

  return (
    <div ref={containerRef} className={cn('relative', className)}>
      {name && (
        <input
          type="hidden"
          name={name}
          value={computeFormValue ? computeFormValue(value) : ''}
          readOnly
          aria-hidden="true"
        />
      )}
      <div className={cn('relative')}>
        <input
          ref={inputRef}
          type="text"
          role="combobox"
          aria-expanded={isOpen}
          aria-controls={isOpen ? 'select-entity-listbox' : undefined}
          aria-autocomplete="list"
          aria-label={ariaLabel}
          aria-describedby={ariaDescribedby}
          placeholder={placeholder}
          className={cn(
            'px-2 py-1  outline-none ring-0 text-12 w-full border border-el-grey-400 rounded-4 control pr-8',
            disabled && 'bg-el-grey-200 cursor-not-allowed opacity-70'
          )}
          value={inputValue}
          onFocus={handleInputFocus}
          onChange={handleInputChange}
          onKeyDown={handleKeyDown}
          disabled={disabled}
        />
        <div className="pointer-events-none absolute top-1/2 -translate-y-1/2 right-2 text-el-grey-400">
          <SearchIcon />
        </div>
      </div>

      {isOpen && (
        <div
          id="select-entity-listbox"
          role="listbox"
          className={cn(
            'absolute z-50 w-full mt-1 border border-el-grey-600 rounded-4 max-h-60 overflow-auto bg-el-grey-100'
          )}
        >
          {isLoading && (
            <div className="px-2 py-1 text-12 text-el-grey-500">Loading…</div>
          )}
          {!isLoading && renderedItems.length === 0 && (
            <div className="px-2 py-1 text-12 text-el-grey-500">No results</div>
          )}
          {!isLoading &&
            renderedItems.map((item, index) => {
              const id = getItemIdProp && getItemIdProp(item);
              const label = getItemLabelProp && getItemLabelProp(item);
              const isSelected = value
                ? getItemIdProp && getItemIdProp(value) === id
                : false;
              const isHighlighted = index === highlightIndex;
              return (
                <div
                  key={id}
                  role="option"
                  aria-selected={isSelected}
                  onMouseDown={(e) => e.preventDefault()} // prevent input blur before click handler
                  onClick={() => handleSelect(item)}
                  className={cn(
                    'px-2 py-1 cursor-pointer text-14 whitespace-nowrap',
                    isSelected
                      ? 'bg-el-grey-200'
                      : 'bg-el-grey-100 hover:bg-el-grey-200 transition-all duration-200',
                    isHighlighted && 'bg-el-grey-200'
                  )}
                >
                  {renderItem ? renderItem(item, isSelected || false) : label}
                </div>
              );
            })}
        </div>
      )}
    </div>
  );
}
