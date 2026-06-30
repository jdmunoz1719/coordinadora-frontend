import { alertsApi } from '@api/alerts/alerts.api';
import { Button } from '@/shared/components/Button';
import { FloatingRefreshButton } from '@shared/components/FloatingRefreshButton';
import { Alert } from '@alerts/interfaces/alert.interface';
import { AlertTriangle, RefreshCw } from 'lucide-react';
import { useMasterData } from '@dashboard/hooks';
import { useCallback, useEffect, useRef, useState } from 'react';
import { AlertFilters, AlertFiltersState } from './AlertFilters';
import { AlertsTable } from './AlertsTable';

export function AlertsTabContainer() {
  useMasterData();
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [data, setData] = useState<Alert.ItemList[]>([]);
  const [page, setPage] = useState(1);
  const [limit, setLimit] = useState(10);
  const [total, setTotal] = useState(0);
  const [filters, setFilters] = useState<AlertFiltersState>({});

  const pageRef = useRef(1);
  const limitRef = useRef(10);
  const filtersRef = useRef<AlertFiltersState>({});

  const hasFetchedRef = useRef(false);

  const load = useCallback(
    async (p = pageRef.current, l = limitRef.current, f = filtersRef.current) => {
      pageRef.current = p;
      limitRef.current = l;
      filtersRef.current = f;
      setIsLoading(true);
      setError(null);
      try {
        const res = await alertsApi.getAll({ page: p, limit: l, ...f });
        setData(res.data);
        setTotal(res.total);
        setPage(p);
        setLimit(l);
        setFilters(f);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Error al cargar alertas');
      } finally {
        setIsLoading(false);
      }
    },
    [],
  );

  useEffect(() => {
    if (hasFetchedRef.current) return;
    hasFetchedRef.current = true;
    load();
  }, [load]);

  const handleFilterChange = useCallback(
    (f: AlertFiltersState) => { filtersRef.current = f; load(1, limitRef.current, f); },
    [load],
  );

  return (
    <>
      <FloatingRefreshButton onClick={() => load(1)} isLoading={isLoading} />

      {error && (
        <div className="flex items-center gap-3 rounded-2xl border border-red-200 bg-red-50 px-5 py-4">
          <AlertTriangle size={20} className="shrink-0 text-red-600" />
          <div className="min-w-0 flex-1">
            <p className="font-semibold text-red-800">Error al cargar alertas</p>
            <p className="truncate text-sm text-red-600">{error}</p>
          </div>
          <Button variant="danger" size="sm" icon={<RefreshCw size={14} />} onClick={() => load()}>
            Reintentar
          </Button>
        </div>
      )}

      <AlertFilters filters={filters} onFilterChange={handleFilterChange} />

      <AlertsTable
        alerts={data}
        isLoading={isLoading}
        page={page}
        limit={limit}
        total={total}
        onPageChange={(p) => load(p)}
        onLimitChange={(l) => load(1, l)}
      />
    </>
  );
}
