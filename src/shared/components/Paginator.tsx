import { memo, useCallback } from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { Button } from './Button';

interface PaginatorProps {
  page: number;
  limit: number;
  total: number;
  onPageChange: (page: number) => void;
  onLimitChange: (limit: number) => void;
}

const PAGE_SIZE_OPTIONS = [10, 20, 50, 100] as const;

export const Paginator = memo(function Paginator({
  page,
  limit,
  total,
  onPageChange,
  onLimitChange,
}: PaginatorProps) {
  const totalPages = Math.ceil(total / limit) || 1;
  const start = (page - 1) * limit + 1;
  const end = Math.min(page * limit, total);

  const handlePrev = useCallback(() => {
    if (page > 1) onPageChange(page - 1);
  }, [page, onPageChange]);

  const handleNext = useCallback(() => {
    if (page < totalPages) onPageChange(page + 1);
  }, [page, totalPages, onPageChange]);

  const handleJump = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      const p = parseInt(e.target.value, 10);
      if (p >= 1 && p <= totalPages) onPageChange(p);
    },
    [totalPages, onPageChange],
  );

  return (
    <div className="flex flex-col gap-3 border-t border-slate-100 px-5 py-4 sm:flex-row sm:items-center sm:justify-between">
      <div className="flex items-center gap-2">
        <label className="text-xs font-medium text-slate-600">Items por página:</label>
        <select
          value={limit}
          onChange={(e) => onLimitChange(parseInt(e.target.value, 10))}
          className="rounded-lg border border-slate-200 bg-white px-2.5 py-1.5 text-xs text-slate-700 shadow-sm focus:border-brand-500 focus:outline-none focus:ring-1 focus:ring-brand-500"
        >
          {PAGE_SIZE_OPTIONS.map((size) => (
            <option key={size} value={size}>
              {size}
            </option>
          ))}
        </select>
      </div>

      <div className="flex items-center gap-2 text-xs text-slate-600">
        <span>
          {total === 0 ? 'Sin resultados' : `${start}-${end} de ${total}`}
        </span>
      </div>

      <div className="flex items-center gap-2">
        <Button
          variant="secondary"
          size="sm"
          icon={<ChevronLeft size={14} />}
          onClick={handlePrev}
          disabled={page === 1}
          aria-label="Página anterior"
        />

        <div className="flex items-center gap-1">
          <label className="text-xs font-medium text-slate-600">Página:</label>
          <input
            type="number"
            min="1"
            max={totalPages}
            value={page}
            onChange={handleJump}
            className="w-12 rounded-lg border border-slate-200 bg-white px-2 py-1.5 text-center text-xs text-slate-700 shadow-sm focus:border-brand-500 focus:outline-none focus:ring-1 focus:ring-brand-500"
          />
          <span className="text-xs font-medium text-slate-600">de {totalPages}</span>
        </div>

        <Button
          variant="secondary"
          size="sm"
          icon={<ChevronRight size={14} />}
          onClick={handleNext}
          disabled={page >= totalPages}
          aria-label="Página siguiente"
        />
      </div>
    </div>
  );
});
