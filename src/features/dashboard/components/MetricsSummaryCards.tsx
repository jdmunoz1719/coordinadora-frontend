import { MetricsDashboard, metricsApi } from "@api/metrics/metrics.api";
import { wsManager } from "@services/websocket/WebSocketManager";
import { AlertTriangle, Bell, CheckCircle2, Zap } from "lucide-react";
import {
  ReactNode,
  memo,
  useCallback,
  useEffect,
  useRef,
  useState,
} from "react";

interface Props {
  refreshSignal?: number;
}

interface StatCardProps {
  label: string;
  value: number | null;
  icon: ReactNode;
  colorClass: string;
}

function StatCard({ label, value, icon, colorClass }: StatCardProps) {
  return (
    <div className="flex items-center gap-4 rounded-2xl border border-slate-200 bg-white px-5 py-4 shadow-card-sm">
      <div
        className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-xl ${colorClass}`}
      >
        {icon}
      </div>
      <div>
        <p className="text-xs font-medium text-slate-400">{label}</p>
        <p className="text-2xl font-bold text-slate-800">
          {value === null ? "—" : value}
        </p>
      </div>
    </div>
  );
}

export const MetricsSummaryCards = memo(function MetricsSummaryCards({
  refreshSignal = 0,
}: Props) {
  const [data, setData] = useState<MetricsDashboard | null>(null);
  const lastSignalRef = useRef(-1);

  const load = useCallback(async () => {
    try {
      const data = await metricsApi.getDashboard();
      setData((prev) =>
        JSON.stringify(prev) === JSON.stringify(data) ? prev : data,
      );
    } catch {
      // Tarjetas muestran '—' si falla
    }
  }, []);

  useEffect(() => {
    if (lastSignalRef.current === refreshSignal) return;
    lastSignalRef.current = refreshSignal;
    load();
  }, [refreshSignal]);

  useEffect(() => {
    const handleMetricsUpdated = (updated: MetricsDashboard) =>
      setData(updated);
    wsManager.on("metrics:updated", handleMetricsUpdated);
    return () => wsManager.off("metrics:updated", handleMetricsUpdated);
  }, []);

  return (
    <div className="grid grid-cols-2 gap-4 lg:grid-cols-4">
      <StatCard
        label="Incidentes resueltos"
        value={data?.totalResolvedIncidents ?? null}
        icon={<CheckCircle2 size={20} className="text-green-600" />}
        colorClass="bg-green-50"
      />
      <StatCard
        label="Incidentes abiertos"
        value={data?.totalOpenedIncidents ?? null}
        icon={<AlertTriangle size={20} className="text-red-600" />}
        colorClass="bg-red-50"
      />
      <StatCard
        label="Total eventos"
        value={data?.totalEvents ?? null}
        icon={<Zap size={20} className="text-blue-600" />}
        colorClass="bg-blue-50"
      />
      <StatCard
        label="Total alertas"
        value={data?.totalAlerts ?? null}
        icon={<Bell size={20} className="text-amber-600" />}
        colorClass="bg-amber-50"
      />
    </div>
  );
});
