/**
 * Sortable Header Component
 * 
 * Reusable component for sortable table column headers with direction indicators
 */

import { ChevronUp, ChevronDown } from 'lucide-react';

interface SortableHeaderProps {
  label: string;
  sortKey: string;
  currentSort: string;
  sortDirection: 'asc' | 'desc';
  onSort: (sortKey: string) => void;
  align?: 'left' | 'center' | 'right';
  className?: string;
}

/**
 * Sortable table header with click handler and direction indicators
 */
export const SortableHeader = ({ 
  label, 
  sortKey, 
  currentSort, 
  sortDirection, 
  onSort, 
  align = 'left',
  className = '' 
}: SortableHeaderProps) => {
  const isActive = currentSort === sortKey;
  const alignmentClass = align === 'center' ? 'justify-center' : align === 'right' ? 'justify-end' : '';
  const textAlignClass = `text-${align}`;

  return (
    <th 
      className={`${textAlignClass} py-4 px-6 font-semibold text-highlight cursor-pointer hover:bg-gray-50 transition-colors ${className}`}
      onClick={() => onSort(sortKey)}
    >
      <div className={`flex items-center gap-1 ${alignmentClass}`}>
        {label}
        <div className="flex flex-col">
          {isActive ? (
            sortDirection === 'asc' ? 
              <ChevronUp className="w-3 h-3" /> : 
              <ChevronDown className="w-3 h-3" />
          ) : (
            <>
              <ChevronUp className="w-3 h-3 text-gray-400 -mb-1" />
              <ChevronDown className="w-3 h-3 text-gray-400" />
            </>
          )}
        </div>
      </div>
    </th>
  );
};
