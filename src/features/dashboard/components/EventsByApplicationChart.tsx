import { memo, useMemo } from 'react';
import { Bar, BarChart, CartesianGrid, Cell, ResponsiveContainer, Tooltip, XAxis, YAxis } from 'recharts';
import { BarChart3, PackageOpen } from 'lucide-react';
import { Card } from '@shared/components/Card';
import { EmptyState } from '@shared/components/EmptyState';
import { LoadingSpinner } from '@shared/components/LoadingSpinner';

interface Props {
  data: Record<string, number>;
  isLoading?: boolean;
}

const COLORS = ['#ef4444', '#f97316', '#eab308', '#22c55e', '#3b82f6', '#8b5cf6', '#ec4899', '#06b6d4', '#84cc16', '#f59e0b'];

const CustomTooltip = ({ active, payload, label }: any) => {
  if (!active || !payload?.length) return null;
  return (
    <div className="rounded-xl border border-slate-200 bg-white px-3 py-2 shadow-card-md text-sm">
      <p className="font-semibold text-slate-700">{label}</p>
      <p className="text-slate-500">{payload[0].value} eventos</p>
    </div>
  );
};

export const EventsByApplicationChart = memo(function EventsByApplicationChart({ data, isLoading = false }: Props) {
  const chartData = useMemo(
    () => Object.entries(data).map(([name, value]) => ({ name, value })).sort((a, b) => b.value - a.value).slice(0, 10),
    [data],
  );

  return (
    <Card>
      <div className="mb-5 flex items-center gap-2">
        <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-blue-50">
          <BarChart3 size={18} className="text-blue-600" />
        </div>
        <div>
          <h3 className="font-semibold text-slate-800">Eventos por Aplicación</h3>
          <p className="text-xs text-slate-400">Top 10</p>
        </div>
      </div>

      {isLoading ? (
        <LoadingSpinner />
      ) : chartData.length === 0 ? (
        <EmptyState icon={<PackageOpen size={28} />} title="Sin datos de eventos" />
      ) : (
        <ResponsiveContainer width="100%" height={280}>
          <BarChart data={chartData} margin={{ top: 4, right: 4, left: -20, bottom: 60 }}>
            <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" vertical={false} />
            <XAxis
              dataKey="name"
              angle={-40}
              textAnchor="end"
              height={75}
              tick={{ fontSize: 11, fill: '#94a3b8' }}
              axisLine={false}
              tickLine={false}
            />
            <YAxis tick={{ fontSize: 11, fill: '#94a3b8' }} axisLine={false} tickLine={false} />
            <Tooltip content={<CustomTooltip />} cursor={{ fill: '#f8fafc' }} />
            <Bar dataKey="value" radius={[8, 8, 0, 0]} maxBarSize={44}>
              {chartData.map((_, i) => (
                <Cell key={i} fill={COLORS[i % COLORS.length]} />
              ))}
            </Bar>
          </BarChart>
        </ResponsiveContainer>
      )}
    </Card>
  );
});
