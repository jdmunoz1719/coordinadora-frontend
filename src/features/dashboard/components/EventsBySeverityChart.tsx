import { eventsApi } from '@api/events/events.api';
import { Event } from '@events/interface/event.interface';
import { Card } from '@shared/components/Card';
import { EmptyState } from '@shared/components/EmptyState';
import { LoadingSpinner } from '@shared/components/LoadingSpinner';
import { AlertCircle, PackageOpen, PieChart as PieIcon, RefreshCw } from 'lucide-react';
import { memo, useCallback, useEffect, useRef, useState } from 'react';
import { Cell, Legend, Pie, PieChart, ResponsiveContainer, Tooltip } from 'recharts';

interface Props {
  refreshSignal?: number;
}

const CustomTooltip = ({ active, payload }: any) => {
  if (!active || !payload?.length) return null;
  return (
    <div className="rounded-xl border border-slate-200 bg-white px-3 py-2 shadow-card-md text-sm">
      <p className="font-semibold text-slate-700">{payload[0].name}</p>
      <p className="text-slate-500">{payload[0].value} eventos</p>
    </div>
  );
};

const renderLabel = ({ cx, cy, midAngle, innerRadius, outerRadius, percent }: any) => {
  if (percent < 0.05) return null;
  const RADIAN = Math.PI / 180;
  const r = innerRadius + (outerRadius - innerRadius) * 0.5;
  const x = cx + r * Math.cos(-midAngle * RADIAN);
  const y = cy + r * Math.sin(-midAngle * RADIAN);
  return (
    <text x={x} y={y} fill="white" textAnchor="middle" dominantBaseline="central" fontSize={12} fontWeight={700}>
      {`${(percent * 100).toFixed(0)}%`}
    </text>
  );
};

export const EventsBySeverityChart = memo(function EventsBySeverityChart({
  refreshSignal = 0,
}: Props) {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [chartData, setChartData] = useState<Event.TotalBySeverity[]>([]);
  const lastSignalRef = useRef(-1);

  const load = useCallback(async () => {
    setIsLoading(true);
    setError(null);
    try {
      const data = await eventsApi.getTotalBySeverity();
      setChartData((prev) =>
        JSON.stringify(prev) === JSON.stringify(data) ? prev : data,
      );
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Error cargando eventos por severidad');
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
        <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-red-50">
          <PieIcon size={18} className="text-red-600" />
        </div>
        <div>
          <h3 className="font-semibold text-slate-800">Eventos por Severidad</h3>
          <p className="text-xs text-slate-400">Total eventos por severidad</p>
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
        <EmptyState icon={<PackageOpen size={28} />} title="Sin datos de severidad" />
      ) : (
        <ResponsiveContainer width="100%" height={280}>
          <PieChart>
            <Pie
              data={chartData}
              cx="50%"
              cy="50%"
              labelLine={false}
              label={renderLabel}
              innerRadius={52}
              outerRadius={95}
              paddingAngle={2}
              dataKey="totalEvents"
              nameKey="severityName"
            >
              {chartData.map((entry) => (
                <Cell key={entry.severityName} fill={entry.color} />
              ))}
            </Pie>
            <Tooltip content={<CustomTooltip />} />
            <Legend iconType="circle" wrapperStyle={{ fontSize: 12, paddingTop: 12 }} />
          </PieChart>
        </ResponsiveContainer>
      )}
    </Card>
  );
});
