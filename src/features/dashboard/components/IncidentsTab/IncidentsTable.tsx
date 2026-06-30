import { Incident } from "@incidents/interfaces/incident.interface";
import { SeverityBadge, StatusBadge } from "@shared/components/Badge";
import { Card } from "@shared/components/Card";
import { EmptyState } from "@shared/components/EmptyState";
import { LoadingSpinner } from "@shared/components/LoadingSpinner";
import { Paginator } from "@shared/components/Paginator";
import { AlertTriangle, CheckCircle2 } from "lucide-react";
import { memo } from "react";

interface IncidentsTableProps {
  incidents: Incident.ItemList[];
  isLoading?: boolean;
  page: number;
  limit: number;
  total: number;
  onPageChange: (page: number) => void;
  onLimitChange: (limit: number) => void;
}

const TH =
  "px-4 py-3 text-left text-xs font-semibold uppercase tracking-wide text-slate-500";

export const IncidentsTable = memo(function IncidentsTable({
  incidents,
  isLoading = false,
  page,
  limit,
  total,
  onPageChange,
  onLimitChange,
}: IncidentsTableProps) {
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
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-50">
                  {incidents.map((incident) => {
                    return (
                      <tr
                        key={incident.id}
                        className="text-sm transition-colors hover:bg-slate-50"
                      >
                        <td className="max-w-xs truncate px-4 py-3 font-medium text-slate-900">
                          {incident.title}
                        </td>
                        <td className="px-4 py-3 text-slate-600">
                          {incident.applicationName ?? "Desconocida"}
                        </td>
                        <td className="px-4 py-3">
                          <SeverityBadge value={incident.severityName} color={incident.severityColor} />
                        </td>
                        <td className="px-4 py-3">
                          <StatusBadge value={incident.statusName} />
                        </td>
                        <td className="px-4 py-3 text-xs text-slate-400">
                          {new Date(incident.createdAt).toLocaleString("es-ES")}
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          )}
        </div>

        <Paginator
          page={page}
          limit={limit}
          total={total}
          onPageChange={onPageChange}
          onLimitChange={onLimitChange}
        />
      </Card>
    </>
  );
});
