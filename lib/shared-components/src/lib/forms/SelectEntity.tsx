'use client';

import { useEffect, useMemo, useRef, useState } from 'react';
import { cn } from '../utils/cn';
import SearchIcon from '../icons/search';
import { BaseEntity } from '../types/Base';

export type SelectEntityServices<T extends BaseEntity> = {
  // Fetch initial/linked entities (shown when opening with empty input). Should return up to maxItems items (or all if maxItems === -1).
  loadInitial: () => Promise<T[]>;
  // Search entities when typing. Should return a reasonably small list (we will cap display to maxItems, or all if maxItems === -1).
  search: (query: string) => Promise<T[]>;
};

export type SelectEntityExtractors<T> = {
  getItemId?: (item: T) => string;
  getItemLabel?: (item: T) => string;
  renderItem?: (item: T, isSelected: boolean) => React.ReactNode;
  getFormValue?: (item: T | null) => string; // hidden input value
};

export type SelectEntityA11y = {
  placeholder?: string;
  disabled?: boolean;
  className?: string;
  name?: string; // hidden input name
  'aria-label'?: string;
  'aria-describedby'?: string;
  maxItems?: number; // maximum number of items to display in dropdown (-1 for unlimited)
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
    getItemId: getItemIdProp = (item) => item.id,
    getItemLabel: getItemLabelProp,
    renderItem,
    placeholder = 'Select an entity…',
    disabled = false,
    className,
    name,
    getFormValue,
    'aria-label': ariaLabel,
    'aria-describedby': ariaDescribedby,
    maxItems = 5,
  } = props;

  const DefaultRenderItem = (item: T) => {
    return <span> {(getItemLabelProp && getItemLabelProp(item)) || '-'}</span>;
  };
  const renderItemInner = renderItem || DefaultRenderItem;

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

  // Clear search input when popover closes
  useEffect(() => {
    if (!isOpen) {
      setInputValue('');
    }
  }, [isOpen]);

  // Close on outside click
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (!containerRef.current) return;
      if (!containerRef.current.contains(event.target as Node)) {
        setIsOpen(false);
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
        const unique = dedupeById(data || [], getItemIdProp);
        const limitedItems =
          maxItems === -1 ? unique : unique.slice(0, maxItems);
        if (!isCancelled) setItems(limitedItems);
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
        const unique = dedupeById(data || [], getItemIdProp);
        const limitedItems =
          maxItems === -1 ? unique : unique.slice(0, maxItems);
        if (!isCancelled) {
          setItems(limitedItems);
          setHighlightIndex((idx) =>
            idx >= 0 &&
            idx <
              (maxItems === -1
                ? limitedItems.length
                : Math.min(maxItems, limitedItems.length))
              ? idx
              : -1
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

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const text = e.target.value;
    setInputValue(text);
    if (!isOpen) setIsOpen(true);
  };

  const handleSelect = (item: T) => {
    onChange(item);
    setInputValue(''); // Clear search when selecting
    setIsOpen(false);
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (!isOpen) return;
    if (items.length === 0) return;
    if (e.key === 'ArrowDown') {
      e.preventDefault();
      setHighlightIndex((prev) => {
        const next = prev + 1;
        return next >=
          (maxItems === -1 ? items.length : Math.min(maxItems, items.length))
          ? 0
          : next;
      });
    } else if (e.key === 'ArrowUp') {
      e.preventDefault();
      setHighlightIndex((prev) => {
        const next = prev - 1;
        return next < 0
          ? (maxItems === -1
              ? items.length
              : Math.min(maxItems, items.length)) - 1
          : next;
      });
    } else if (e.key === 'Enter') {
      e.preventDefault();
      const idx = highlightIndex >= 0 ? highlightIndex : 0;
      const item = items[idx];
      if (item) handleSelect(item);
    } else if (e.key === 'Escape') {
      e.preventDefault();
      setIsOpen(false);
    }
  };

  const renderedItems = useMemo(
    () => (maxItems === -1 ? items : items.slice(0, maxItems)),
    [items, maxItems]
  );

  return (
    <div ref={containerRef} className={cn('relative', className)}>
      {name && (
        <input
          type="hidden"
          name={name}
          id={name}
          value={computeFormValue ? computeFormValue(value) : ''}
          readOnly
          aria-hidden="true"
        />
      )}

      {/* Display element showing selected value */}
      <div
        id={`${name}-display`}
        role="combobox"
        aria-expanded={isOpen}
        aria-controls={isOpen ? 'select-entity-listbox' : undefined}
        aria-label={ariaLabel}
        aria-describedby={ariaDescribedby}
        tabIndex={disabled ? -1 : 0}
        className={cn(
          'px-2 py-1 outline-none ring-0 text-12 w-full border border-el-grey-400 rounded-4 control pr-8 cursor-pointer',
          disabled && 'bg-el-grey-200 cursor-not-allowed opacity-70',
          !disabled && 'hover:border-el-grey-500 focus:border-el-blue-500'
        )}
        onClick={disabled ? undefined : () => setIsOpen(!isOpen)}
        onKeyDown={(e) => {
          if (disabled) return;
          if (e.key === 'Enter' || e.key === ' ') {
            e.preventDefault();
            setIsOpen(!isOpen);
          } else if (e.key === 'ArrowDown' && !isOpen) {
            e.preventDefault();
            setIsOpen(true);
          }
        }}
      >
        {value && getItemLabelProp ? (
          getItemLabelProp(value)
        ) : (
          <span className="text-el-grey-500">{placeholder}</span>
        )}
      </div>
      <div className="pointer-events-none absolute top-1/2 -translate-y-1/2 right-2 text-el-grey-400">
        <SearchIcon />
      </div>

      {isOpen && (
        <div
          id="select-entity-listbox"
          role="listbox"
          className={cn(
            'absolute z-50 w-full mt-1 border border-el-grey-600 rounded-4 max-h-60 bg-el-grey-100 flex flex-col'
          )}
        >
          {/* Sticky search input inside popover */}
          <div className="sticky top-0 z-10 p-2 border-b border-el-grey-300 bg-el-grey-100">
            <input
              ref={inputRef}
              type="text"
              placeholder="Search..."
              className={cn(
                'px-2 py-1 outline-none ring-0 text-12 w-full border border-el-grey-400 rounded-4 focus:border-el-blue-500'
              )}
              value={inputValue}
              onChange={handleInputChange}
              onKeyDown={handleKeyDown}
              autoFocus
            />
          </div>

          <div className="overflow-auto flex-1">
            {isLoading && (
              <div className="px-2 py-1 text-12 text-el-grey-500">Loading…</div>
            )}
            {!isLoading && renderedItems.length === 0 && (
              <div className="px-2 py-1 text-12 text-el-grey-500">
                No results
              </div>
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
                    {renderItemInner
                      ? renderItemInner(item, isSelected || false)
                      : label}
                  </div>
                );
              })}
          </div>
        </div>
      )}
    </div>
  );
}
