import { Event } from "@events/interface/event.interface";
import { SeverityBadge } from "@shared/components/Badge";
import { Card } from "@shared/components/Card";
import { EmptyState } from "@shared/components/EmptyState";
import { LoadingSpinner } from "@shared/components/LoadingSpinner";
import { Paginator } from "@shared/components/Paginator";
import { Activity, Clock } from "lucide-react";
import { memo } from "react";

interface EventsTableProps {
  events: Event.ItemList[];
  isLoading?: boolean;
  page: number;
  limit: number;
  total: number;
  onPageChange: (page: number) => void;
  onLimitChange: (limit: number) => void;
}

const th =
  "px-4 py-3 text-left text-xs font-semibold uppercase tracking-wide text-slate-500";

export const EventsTable = memo(function EventsTable({
  events,
  isLoading = false,
  page,
  limit,
  total,
  onPageChange,
  onLimitChange,
}: EventsTableProps) {
  return (
    <Card padding="none" className="overflow-hidden flex flex-col">
      <div className="flex items-center gap-2 border-b border-slate-100 px-5 py-4">
        <Activity size={18} className="text-blue-500" />
        <h3 className="font-semibold text-slate-800">Eventos</h3>
        <span className="ml-auto rounded-full bg-slate-100 px-2.5 py-0.5 text-xs font-bold text-slate-600 tabular-nums">
          {total}
        </span>
      </div>

      <div className="flex-1">
        {isLoading && events.length === 0 ? (
          <LoadingSpinner message="Cargando eventos..." />
        ) : events.length === 0 ? (
          <EmptyState
            icon={<Activity size={28} />}
            title="Sin eventos"
            description="No se encontraron eventos con los filtros seleccionados."
          />
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-slate-50 border-b border-slate-100">
                <tr>
                  <th className={th}>Aplicación</th>
                  <th className={th}>Tipo</th>
                  <th className={th}>Severidad</th>
                  <th className={th}>Descripción</th>
                  <th className={th}>Ocurrió</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-50">
                {events.map((event) => (
                  <tr
                    key={event.id}
                    className="hover:bg-slate-50 transition-colors text-sm"
                  >
                    <td className="px-4 py-3 font-medium text-slate-700">
                      {event.applicationName ?? "Desconocida"}
                    </td>
                    <td className="px-4 py-3 text-slate-600">
                      {event.eventTypeName ?? "Desconocido"}
                    </td>
                    <td className="px-4 py-3">
                      <SeverityBadge value={event.severityName} color={event.severityColor} />
                    </td>
                    <td className="px-4 py-3 text-slate-600 max-w-xs truncate">
                      {event.description}
                    </td>
                    <td className="px-4 py-3 text-xs text-slate-400">
                      <div className="flex items-center gap-1">
                        <Clock size={12} />
                        {new Date(event.occurredAt).toLocaleString("es-ES")}
                      </div>
                    </td>
                  </tr>
                ))}
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
  );
});
