import { memo, useMemo } from 'react';
import { Cell, Legend, Pie, PieChart, ResponsiveContainer, Tooltip } from 'recharts';
import { PieChart as PieIcon, PackageOpen } from 'lucide-react';
import { Card } from '@shared/components/Card';
import { EmptyState } from '@shared/components/EmptyState';
import { LoadingSpinner } from '@shared/components/LoadingSpinner';
import { SEVERITY_COLORS } from '@config/constants';

interface Props {
  data: Record<string, number>;
  isLoading?: boolean;
}

const ORDER = ['CRITICAL', 'HIGH', 'MEDIUM', 'LOW', 'INFO'];

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

export const EventsBySeverityChart = memo(function EventsBySeverityChart({ data, isLoading = false }: Props) {
  const chartData = useMemo(() => ORDER.filter((s) => data[s]).map((s) => ({ name: s, value: data[s] })), [data]);

  return (
    <Card>
      <div className="mb-5 flex items-center gap-2">
        <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-red-50">
          <PieIcon size={18} className="text-red-600" />
        </div>
        <div>
          <h3 className="font-semibold text-slate-800">Eventos por Severidad</h3>
          <p className="text-xs text-slate-400">Distribución actual</p>
        </div>
      </div>

      {isLoading ? (
        <LoadingSpinner />
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
              dataKey="value"
            >
              {chartData.map((entry) => (
                <Cell key={entry.name} fill={SEVERITY_COLORS[entry.name as keyof typeof SEVERITY_COLORS]} />
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
