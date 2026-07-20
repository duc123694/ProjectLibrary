import React from 'react';
import { ChevronLeft, ChevronRight, ChevronsLeft, ChevronsRight } from 'lucide-react';

interface PaginationProps {
  currentPage: number; // 0-indexed
  totalPages: number;
  totalElements: number;
  pageSize: number;
  onPageChange: (page: number) => void;
  loading?: boolean;
}

const Pagination: React.FC<PaginationProps> = ({
  currentPage,
  totalPages,
  totalElements,
  pageSize,
  onPageChange,
  loading = false,
}) => {
  if (totalPages <= 1) return null;

  const start = currentPage * pageSize + 1;
  const end = Math.min((currentPage + 1) * pageSize, totalElements);

  const getPageNumbers = () => {
    const pages: (number | 'ellipsis')[] = [];
    const maxVisible = 5;

    if (totalPages <= maxVisible + 2) {
      for (let i = 0; i < totalPages; i++) pages.push(i);
    } else {
      pages.push(0);
      if (currentPage > 2) pages.push('ellipsis');
      const rangeStart = Math.max(1, currentPage - 1);
      const rangeEnd = Math.min(totalPages - 2, currentPage + 1);
      for (let i = rangeStart; i <= rangeEnd; i++) pages.push(i);
      if (currentPage < totalPages - 3) pages.push('ellipsis');
      pages.push(totalPages - 1);
    }
    return pages;
  };

  const btnBase = `flex items-center justify-center w-9 h-9 rounded-xl text-sm font-medium transition-all duration-200`;

  return (
    <div className="flex flex-col sm:flex-row items-center justify-between gap-4 pt-4">
      <p className="text-sm text-surface-500">
        Hiển thị <span className="font-semibold text-surface-700">{start}–{end}</span> trong tổng số{' '}
        <span className="font-semibold text-surface-700">{totalElements}</span> kết quả
      </p>

      <div className="flex items-center gap-1">
        {/* First */}
        <button
          onClick={() => onPageChange(0)}
          disabled={currentPage === 0 || loading}
          className={`${btnBase} ${currentPage === 0 ? 'text-surface-300 cursor-not-allowed' : 'text-surface-500 hover:bg-surface-100 hover:text-surface-700'}`}
        >
          <ChevronsLeft className="w-4 h-4" />
        </button>

        {/* Prev */}
        <button
          onClick={() => onPageChange(currentPage - 1)}
          disabled={currentPage === 0 || loading}
          className={`${btnBase} ${currentPage === 0 ? 'text-surface-300 cursor-not-allowed' : 'text-surface-500 hover:bg-surface-100 hover:text-surface-700'}`}
        >
          <ChevronLeft className="w-4 h-4" />
        </button>

        {/* Page Numbers */}
        {getPageNumbers().map((page, idx) =>
          page === 'ellipsis' ? (
            <span key={`ellipsis-${idx}`} className="w-9 text-center text-surface-400 text-sm">…</span>
          ) : (
            <button
              key={page}
              onClick={() => onPageChange(page)}
              disabled={loading}
              className={`${btnBase} ${
                page === currentPage
                  ? 'bg-primary-600 text-white shadow-md shadow-primary-500/30'
                  : 'text-surface-600 hover:bg-surface-100 hover:text-surface-800'
              }`}
            >
              {page + 1}
            </button>
          )
        )}

        {/* Next */}
        <button
          onClick={() => onPageChange(currentPage + 1)}
          disabled={currentPage === totalPages - 1 || loading}
          className={`${btnBase} ${currentPage === totalPages - 1 ? 'text-surface-300 cursor-not-allowed' : 'text-surface-500 hover:bg-surface-100 hover:text-surface-700'}`}
        >
          <ChevronRight className="w-4 h-4" />
        </button>

        {/* Last */}
        <button
          onClick={() => onPageChange(totalPages - 1)}
          disabled={currentPage === totalPages - 1 || loading}
          className={`${btnBase} ${currentPage === totalPages - 1 ? 'text-surface-300 cursor-not-allowed' : 'text-surface-500 hover:bg-surface-100 hover:text-surface-700'}`}
        >
          <ChevronsRight className="w-4 h-4" />
        </button>
      </div>
    </div>
  );
};

export default Pagination;
