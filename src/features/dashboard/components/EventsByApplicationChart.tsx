import { eventsApi } from "@api/events/events.api";
import { Event } from "@events/interface/event.interface";
import { Card } from "@shared/components/Card";
import { EmptyState } from "@shared/components/EmptyState";
import { LoadingSpinner } from "@shared/components/LoadingSpinner";
import { AlertCircle, BarChart3, PackageOpen, RefreshCw } from "lucide-react";
import { memo, useCallback, useEffect, useRef, useState } from "react";
import {
  Bar,
  BarChart,
  CartesianGrid,
  Cell,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";

interface Props {
  refreshSignal?: number;
}

const generateColors = (count: number): string[] =>
  Array.from(
    { length: count },
    (_, i) => `hsl(${Math.round((i * 360) / count)}deg, 65%, 55%)`,
  );

const CustomTooltip = ({ active, payload, label }: any) => {
  if (!active || !payload?.length) return null;
  return (
    <div className="rounded-xl border border-slate-200 bg-white px-3 py-2 shadow-card-md text-sm">
      <p className="font-semibold text-slate-700">{label}</p>
      <p className="text-slate-500">{payload[0].value} eventos</p>
    </div>
  );
};

export const EventsByApplicationChart = memo(function EventsByApplicationChart({
  refreshSignal = 0,
}: Props) {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [chartData, setChartData] = useState<Event.TotalByApplication[]>([]);
  const lastSignalRef = useRef(-1);

  const load = useCallback(async () => {
    setIsLoading(true);
    setError(null);
    try {
      const data = await eventsApi.getTotalByApplication();
      setChartData((prev) =>
        JSON.stringify(prev) === JSON.stringify(data) ? prev : data,
      );
    } catch (err) {
      setError(
        err instanceof Error
          ? err.message
          : "Error cargando eventos por aplicación",
      );
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    if (lastSignalRef.current === refreshSignal) return;
    lastSignalRef.current = refreshSignal;
    load();
  }, [refreshSignal]);

  return (
    <Card>
      <div className="mb-5 flex items-center gap-2">
        <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-blue-50">
          <BarChart3 size={18} className="text-blue-600" />
        </div>
        <div>
          <h3 className="font-semibold text-slate-800">
            Eventos por Aplicación
          </h3>
          <p className="text-xs text-slate-400">Total eventos por aplicación</p>
        </div>
      </div>

      {isLoading ? (
        <LoadingSpinner />
      ) : error ? (
        <div className="flex flex-col items-center gap-3 py-10 text-center">
          <AlertCircle size={28} className="text-red-400" />
          <p className="text-sm text-slate-500">{error}</p>
          <button
            onClick={load}
            className="flex items-center gap-1.5 rounded-lg border border-slate-200 px-3 py-1.5 text-xs font-medium text-slate-600 hover:bg-slate-50 transition-colors"
          >
            <RefreshCw size={13} />
            Reintentar
          </button>
        </div>
      ) : chartData.length === 0 ? (
        <EmptyState
          icon={<PackageOpen size={28} />}
          title="Sin datos de eventos"
        />
      ) : (
        <ResponsiveContainer width="100%" height={280}>
          <BarChart
            data={chartData}
            margin={{ top: 4, right: 4, left: -20, bottom: 60 }}
          >
            <CartesianGrid
              strokeDasharray="3 3"
              stroke="#f1f5f9"
              vertical={false}
            />
            <XAxis
              dataKey="applicationName"
              angle={-40}
              textAnchor="end"
              height={75}
              tick={{ fontSize: 11, fill: "#94a3b8" }}
              axisLine={false}
              tickLine={false}
            />
            <YAxis
              tick={{ fontSize: 11, fill: "#94a3b8" }}
              axisLine={false}
              tickLine={false}
            />
            <Tooltip content={<CustomTooltip />} cursor={{ fill: "#f8fafc" }} />
            <Bar dataKey="totalEvents" radius={[8, 8, 0, 0]} maxBarSize={44}>
              {generateColors(chartData.length).map((color, i) => (
                <Cell key={i} fill={color} />
              ))}
            </Bar>
          </BarChart>
        </ResponsiveContainer>
      )}
    </Card>
  );
});
