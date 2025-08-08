import * as React from 'react';
import { cn } from '../../lib/utils';

export interface Column<T extends Record<string, any>> {
  key: keyof T;
  header: string;
  sortable?: boolean;
}

export interface TableProps<T extends Record<string, any>> {
  columns: Column<T>[];
  data: T[];
  caption?: string;
}

export function Table<T extends Record<string, any>>({
  columns,
  data,
  caption,
}: TableProps<T>) {
  const [sortKey, setSortKey] = React.useState<keyof T | null>(null);
  const [sortDir, setSortDir] = React.useState<'asc' | 'desc'>('asc');
  const [dense, setDense] = React.useState(false);

  const sorted = React.useMemo(() => {
    if (!sortKey) return data;
    return [...data].sort((a, b) => {
      const aVal = a[sortKey];
      const bVal = b[sortKey];
      const aStr = String(aVal);
      const bStr = String(bVal);
      const comparison = aStr.localeCompare(bStr, undefined, { numeric: true });
      return sortDir === 'asc' ? comparison : -comparison;
    });
  }, [data, sortKey, sortDir]);

  const toggleSort = (key: keyof T) => {
    if (sortKey === key) {
      setSortDir(sortDir === 'asc' ? 'desc' : 'asc');
    } else {
      setSortKey(key);
      setSortDir('asc');
    }
  };

  const getAriaSort = (key: keyof T) => {
    if (sortKey !== key) return 'none';
    return sortDir === 'asc' ? 'ascending' : 'descending';
  };

  return (
    <div className="w-full space-y-2">
      <div className="flex justify-end">
        <button
          type="button"
          aria-pressed={dense}
          className="text-sm px-2 py-1 border rounded"
          onClick={() => setDense(!dense)}
        >
          {dense ? 'Comfortable rows' : 'Compact rows'}
        </button>
      </div>
      <table className={cn('w-full border-collapse', dense ? 'text-sm' : 'text-base')}>
        {caption && (
          <caption className="text-left caption-top">{caption}</caption>
        )}
        <thead>
          <tr>
            {columns.map((col) => (
              <th
                key={String(col.key)}
                scope="col"
                aria-sort={getAriaSort(col.key)}
                className="text-left px-4 py-2"
              >
                {col.sortable ? (
                  <button
                    type="button"
                    onClick={() => toggleSort(col.key)}
                    className="flex items-center gap-1 focus:outline-none"
                  >
                    {col.header}
                    <span aria-hidden="true">
                      {sortKey === col.key ? (sortDir === 'asc' ? '▲' : '▼') : ''}
                    </span>
                  </button>
                ) : (
                  col.header
                )}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {sorted.map((row, idx) => (
            <tr key={idx} className={dense ? 'h-8' : 'h-12'}>
              {columns.map((col) => (
                <td key={String(col.key)} className={cn('px-4 py-2', dense && 'py-1')}>
                  {row[col.key] as React.ReactNode}
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
