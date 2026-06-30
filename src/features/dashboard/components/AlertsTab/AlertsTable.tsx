import { Alert } from "@alerts/interfaces/alert.interface";
import { SeverityBadge } from "@shared/components/Badge";
import { Card } from "@shared/components/Card";
import { EmptyState } from "@shared/components/EmptyState";
import { LoadingSpinner } from "@shared/components/LoadingSpinner";
import { Paginator } from "@shared/components/Paginator";
import { formatDistanceToNow } from "date-fns";
import { es } from "date-fns/locale";
import { BellOff, BellRing } from "lucide-react";
import { memo } from "react";

interface AlertsTableProps {
  alerts: Alert.ItemList[];
  isLoading?: boolean;
  page: number;
  limit: number;
  total: number;
  onPageChange: (page: number) => void;
  onLimitChange: (limit: number) => void;
}

const th =
  "px-4 py-3 text-left text-xs font-semibold uppercase tracking-wide text-slate-500";

export const AlertsTable = memo(function AlertsTable({
  alerts,
  isLoading = false,
  page,
  limit,
  total,
  onPageChange,
  onLimitChange,
}: AlertsTableProps) {
  return (
    <Card padding="none" className="overflow-hidden flex flex-col">
      <div className="flex items-center gap-2 border-b border-slate-100 px-5 py-4">
        <BellRing size={18} className="text-amber-500" />
        <h3 className="font-semibold text-slate-800">Alertas Generadas</h3>
        <span className="ml-auto rounded-full bg-slate-100 px-2.5 py-0.5 text-xs font-bold text-slate-600 tabular-nums">
          {total}
        </span>
      </div>

      <div className="flex-1">
        {isLoading && alerts.length === 0 ? (
          <LoadingSpinner message="Cargando alertas..." />
        ) : alerts.length === 0 ? (
          <EmptyState
            icon={<BellOff size={28} />}
            title="Sin alertas activas"
            description="Cuando se generen alertas críticas aparecerán aquí."
          />
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-slate-50 border-b border-slate-100">
                <tr>
                  <th className={th}>Severidad</th>
                  <th className={th}>Aplicación</th>
                  <th className={th}>Estado</th>
                  <th className={th}>Creada</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-50">
                {alerts.map((alert) => (
                  <tr
                    key={alert.id}
                    className="hover:bg-slate-50 transition-colors text-sm"
                  >
                    <td className="px-4 py-3">
                      <SeverityBadge value={alert.severityName} />
                    </td>
                    <td className="px-4 py-3 text-sm font-medium text-slate-700">
                      {alert.applicationName ?? "Desconocida"}
                    </td>
                    <td className="px-4 py-3">
                      <span className="inline-flex items-center gap-1 rounded-full bg-slate-100 px-2.5 py-0.5 text-xs font-semibold text-slate-600">
                        {alert.statusName ?? "PENDING"}
                      </span>
                    </td>
                    <td className="px-4 py-3 text-xs text-slate-400">
                      {formatDistanceToNow(new Date(alert.createdAt), {
                        addSuffix: true,
                        locale: es,
                      })}
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
