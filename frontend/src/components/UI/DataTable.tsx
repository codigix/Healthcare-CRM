"use client";

import React, { useState, useMemo, useEffect } from 'react';
import { ChevronLeft, ChevronRight, ArrowUpDown, ArrowUp, ArrowDown } from 'lucide-react';

export interface Column<T> {
  header: string;
  accessor: string | ((row: T) => React.ReactNode);
  sortable?: boolean;
}

interface DataTableProps<T> {
  columns: Column<T>[];
  data: T[];
  searchTerm?: string;
  enablePagination?: boolean;
  /** Same as enablePagination: paginate the rows in the browser (default on). */
  enableLocalPagination?: boolean;
  /** Show a search box above the table that filters the rows in the browser. */
  enableLocalSearch?: boolean;
  itemsPerPage?: number;
  isLoading?: boolean;
}

export function DataTable<T>({
  columns,
  data,
  searchTerm = "",
  enablePagination = true,
  enableLocalPagination,
  enableLocalSearch = false,
  itemsPerPage = 10,
  isLoading = false,
}: DataTableProps<T>) {
  const paginate = enableLocalPagination ?? enablePagination;
  const [currentPage, setCurrentPage] = useState(1);
  const [localSearch, setLocalSearch] = useState("");
  const [sortConfig, setSortConfig] = useState<{ key: string; direction: 'asc' | 'desc' } | null>(null);

  // A search term passed by the page wins; otherwise use the built-in search box.
  const activeSearch = searchTerm || (enableLocalSearch ? localSearch : "");

  const filteredData = useMemo(() => {
    let result = [...(data || [])];

    if (activeSearch) {
      const lowerSearch = activeSearch.toLowerCase();
      result = result.filter((row) => {
        return Object.values(row as any).some((val) =>
          String(val).toLowerCase().includes(lowerSearch)
        );
      });
    }

    if (sortConfig) {
      result.sort((a: any, b: any) => {
        const aVal = a[sortConfig.key];
        const bVal = b[sortConfig.key];
        if (aVal < bVal) return sortConfig.direction === 'asc' ? -1 : 1;
        if (aVal > bVal) return sortConfig.direction === 'asc' ? 1 : -1;
        return 0;
      });
    }

    return result;
  }, [data, activeSearch, sortConfig]);

  // Go back to the first page whenever the search changes.
  useEffect(() => {
    setCurrentPage(1);
  }, [activeSearch]);

  const paginatedData = useMemo(() => {
    if (!paginate) return filteredData;
    const startIndex = (currentPage - 1) * itemsPerPage;
    return filteredData.slice(startIndex, startIndex + itemsPerPage);
  }, [filteredData, paginate, currentPage, itemsPerPage]);

  const totalPages = Math.ceil(filteredData.length / itemsPerPage);

  const handleSort = (key: string) => {
    let direction: 'asc' | 'desc' = 'asc';
    if (sortConfig && sortConfig.key === key && sortConfig.direction === 'asc') {
      direction = 'desc';
    } else if (sortConfig && sortConfig.key === key && sortConfig.direction === 'desc') {
      // Third click: remove sorting
      setSortConfig(null);
      return;
    }
    setSortConfig({ key, direction });
  };

  return (
    <div className="w-full flex flex-col">
      {enableLocalSearch && (
        <div className="mb-3">
          <input
            type="text"
            value={localSearch}
            onChange={(e) => setLocalSearch(e.target.value)}
            placeholder="Search..."
            aria-label="Search table"
            className="w-full max-w-xs rounded-lg border border-dark-tertiary bg-dark-primary px-3 py-2 text-xs text-gray-200 placeholder:text-gray-500 focus:border-accent focus:outline-none focus:ring-1 focus:ring-accent"
          />
        </div>
      )}
      <table className="w-full text-left border border-gray-200">
        <thead>
          <tr className=" border-b bg-gray-200 border-gray-800 text-gray-400 text-xs whitespace-nowrap">
            {columns.map((col, index) => (
              <th
                key={index}
                className={`p-2 font-medium transition-colors ${col.sortable ? 'cursor-pointer hover:text-white select-none' : ''}`}
                onClick={() => col.sortable && typeof col.accessor === 'string' && handleSort(col.accessor)}
              >
                <div className={`flex items-center gap-2 ${index === columns.length - 1 ? 'justify-end' : ''}`}>
                  {col.header}
                  {col.sortable && typeof col.accessor === 'string' && (
                    <span className="text-gray-500">
                      {sortConfig?.key === col.accessor ? (
                        sortConfig.direction === 'asc' ? <ArrowUp size={14} className="text-blue-400" /> : <ArrowDown size={14} className="text-blue-400" />
                      ) : (
                        <ArrowUpDown size={14} className="opacity-50" />
                      )}
                    </span>
                  )}
                </div>
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {isLoading ? (
            Array.from({ length: Math.min(itemsPerPage, 5) }).map((_, rowIndex) => (
              <tr key={rowIndex} className="border-b border-gray-800">
                {columns.map((col, colIndex) => (
                  <td key={colIndex} className="p-2">
                    <div aria-hidden="true" className="skeleton h-4 w-full rounded"></div>
                  </td>
                ))}
              </tr>
            ))
          ) : paginatedData.length > 0 ? (
            paginatedData.map((row, rowIndex) => (
              <tr key={rowIndex} className="border-b border-gray-800 hover:bg-dark-tertiary/30 transition-colors">
                {columns.map((col, colIndex) => (
                  <td key={colIndex} className={`p-2 whitespace-nowrap ${colIndex === columns.length - 1 ? 'text-right' : ''}`}>
                    {typeof col.accessor === 'function'
                      ? col.accessor(row)
                      : (
                        colIndex === 0
                          ? <span className="text-xs  text-white">{String((row as any)[col.accessor] || '')}</span>
                          : <span className="text-gray-400 text-xs">{String((row as any)[col.accessor] || '')}</span>
                      )}
                  </td>
                ))}
              </tr>
            ))
          ) : (
            <tr>
              <td colSpan={columns.length} className="p-2 text-center text-gray-500 border-b border-gray-800 h-32">
                No matching records found.
              </td>
            </tr>
          )}
        </tbody>
      </table>

      {paginate && (
        <div className="flex items-center justify-between my-3">
          <p className="text-xs text-gray-400">
            Showing {filteredData.length === 0 ? 0 : ((currentPage - 1) * itemsPerPage) + 1} to {Math.min(currentPage * itemsPerPage, filteredData.length)} of {filteredData.length} entries
          </p>
          <div className="flex items-center gap-2">
            <button
              onClick={() => setCurrentPage(p => Math.max(1, p - 1))}
              disabled={currentPage === 1}
              className="p-2 border border-gray-700 rounded-md disabled:opacity-50 hover:bg-dark-tertiary text-gray-300 transition-colors"
            >
              <ChevronLeft size={15} />
            </button>
            <span className="text-sm font-medium text-gray-400 px-2">Page <span className="text-white">{currentPage}</span> of {Math.max(1, totalPages)}</span>
            <button
              onClick={() => setCurrentPage(p => Math.min(totalPages, p + 1))}
              disabled={currentPage >= totalPages || totalPages === 0}
              className="p-1.5 border border-gray-700 rounded-md disabled:opacity-50 hover:bg-dark-tertiary text-gray-300 transition-colors"
            >
              <ChevronRight size={15} />
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

export default DataTable;
