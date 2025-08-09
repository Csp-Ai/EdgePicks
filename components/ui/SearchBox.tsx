import React, { useMemo, useState } from 'react';
import { cn } from '../../lib/utils';
import { createFuzzySearch, FuzzyOptions } from '../../lib/search/fuzzy';

export interface SearchBoxProps<T> {
  items: T[];
  options: FuzzyOptions<T>;
  renderItem: (item: T) => React.ReactNode;
  onSelect?: (item: T) => void;
  placeholder?: string;
  className?: string;
}

function SearchBox<T>({
  items,
  options,
  renderItem,
  onSelect,
  placeholder = 'Search...',
  className,
}: SearchBoxProps<T>) {
  const [query, setQuery] = useState('');
  const search = useMemo(() => createFuzzySearch(items, options), [items, options]);
  const results = useMemo(() => search(query), [search, query]);

  return (
    <div className={cn('relative', className)}>
      <input
        type="text"
        value={query}
        onChange={(e) => setQuery(e.target.value)}
        placeholder={placeholder}
        className="w-full px-2 py-1 border rounded text-slate-900"
        data-testid="searchbox-input"
      />
      {query && (
        <ul
          className="absolute z-10 left-0 right-0 mt-1 border rounded bg-white text-slate-900 divide-y"
          data-testid="searchbox-results"
        >
          {results.length === 0 && (
            <li className="px-2 py-1 text-slate-500" data-testid="searchbox-empty">
              No matches
            </li>
          )}
          {results.map((item, idx) => (
            <li key={idx}>
              <button
                type="button"
                onClick={() => onSelect?.(item)}
                className="block w-full text-left px-2 py-1 hover:bg-slate-100"
                data-testid="searchbox-item"
              >
                {renderItem(item)}
              </button>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}

export default SearchBox;
