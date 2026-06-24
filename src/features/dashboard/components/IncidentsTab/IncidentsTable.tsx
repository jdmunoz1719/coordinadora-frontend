import { memo, useState, useCallback } from 'react';
import { AlertTriangle, CheckCircle2, RefreshCw } from 'lucide-react';
import { Card } from '@shared/components/Card';
import { SeverityBadge, StatusBadge } from '@shared/components/Badge';
import { EmptyState } from '@shared/components/EmptyState';
import { LoadingSpinner } from '@shared/components/LoadingSpinner';
import { Paginator } from '@shared/components/Paginator';
import { ChangeStatusModal } from './ChangeStatusModal';
import { dashboardService } from '@services/dashboard/dashboardService';
import { useDashboardStore } from '@store/dashboardStore';
import type { Incident } from '@types/dashboard.types';

interface IncidentsTableProps {
  incidents: Incident[];
  isLoading?: boolean;
  page: number;
  limit: number;
  total: number;
  onPageChange: (page: number) => void;
  onLimitChange: (limit: number) => void;
}

const TH = 'px-4 py-3 text-left text-xs font-semibold uppercase tracking-wide text-slate-500';
const CLOSED_STATUSES = new Set(['CLOSED']);

export const IncidentsTable = memo(function IncidentsTable({
  incidents,
  isLoading = false,
  page,
  limit,
  total,
  onPageChange,
  onLimitChange,
}: IncidentsTableProps) {
  const [selected, setSelected] = useState<Incident | null>(null);

  const handleConfirm = useCallback(
    async (incidentId: string, newStatus: string, reason: string) => {
      const updated = await dashboardService.updateIncidentStatus(incidentId, newStatus, reason);
      useDashboardStore.getState().updateIncident(updated);
    },
    [],
  );

  return (
    <>
      <Card padding="none" className="overflow-hidden flex flex-col">
        <div className="flex items-center gap-2 border-b border-slate-100 px-5 py-4">
          <AlertTriangle size={18} className="text-red-500" />
          <h3 className="font-semibold text-slate-800">Incidentes Abiertos</h3>
          <span className="ml-auto rounded-full bg-slate-100 px-2.5 py-0.5 text-xs font-bold text-slate-600 tabular-nums">
            {total}
          </span>
        </div>

        <div className="flex-1">
          {isLoading && incidents.length === 0 ? (
            <LoadingSpinner message="Cargando incidentes..." />
          ) : incidents.length === 0 ? (
            <EmptyState
              icon={<CheckCircle2 size={28} />}
              title="Todo en orden"
              description="No hay incidentes abiertos en este momento."
            />
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="border-b border-slate-100 bg-slate-50">
                  <tr>
                    <th className={TH}>Título</th>
                    <th className={TH}>Aplicación</th>
                    <th className={TH}>Severidad</th>
                    <th className={TH}>Estado</th>
                    <th className={TH}>Creado</th>
                    <th className={TH + ' w-36'}>Acciones</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-50">
                  {incidents.map((incident) => {
                    const canChange = !CLOSED_STATUSES.has(incident.statusName?.toUpperCase() ?? '');
                    return (
                      <tr key={incident.id} className="text-sm transition-colors hover:bg-slate-50">
                        <td className="max-w-xs truncate px-4 py-3 font-medium text-slate-900">
                          {incident.title}
                        </td>
                        <td className="px-4 py-3 text-slate-600">
                          {incident.applicationName ?? 'Desconocida'}
                        </td>
                        <td className="px-4 py-3">
                          <SeverityBadge value={incident.severityName} />
                        </td>
                        <td className="px-4 py-3">
                          <StatusBadge value={incident.statusName} />
                        </td>
                        <td className="px-4 py-3 text-xs text-slate-400">
                          {new Date(incident.createdAt).toLocaleString('es-ES')}
                        </td>
                        <td className="px-4 py-3">
                          {canChange && (
                            <button
                              onClick={() => setSelected(incident)}
                              className="inline-flex items-center gap-1.5 rounded-lg border border-slate-200 bg-white px-3 py-1.5 text-xs font-medium text-slate-600 shadow-sm transition-colors hover:border-brand-300 hover:bg-brand-50 hover:text-brand-700"
                            >
                              <RefreshCw size={12} />
                              Cambiar estado
                            </button>
                          )}
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          )}
        </div>

        <Paginator page={page} limit={limit} total={total} onPageChange={onPageChange} onLimitChange={onLimitChange} />
      </Card>

      {selected && (
        <ChangeStatusModal
          incidentId={selected.id}
          incidentTitle={selected.title}
          currentStatus={selected.statusName ?? 'OPEN'}
          onConfirm={handleConfirm}
          onClose={() => setSelected(null)}
        />
      )}
    </>
  );
});
