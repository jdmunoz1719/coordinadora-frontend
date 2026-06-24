import { memo } from 'react';
import { AlertCircle, AlertTriangle, Info, CheckCircle2, XCircle, PlayCircle, PauseCircle, RadioTower } from 'lucide-react';
import { STATUS_LABELS } from '@config/constants';

const SEVERITY_CONFIG: Record<string, { cls: string; Icon: (p: { size?: number }) => JSX.Element }> = {
  CRITICAL: { cls: 'bg-red-50 text-red-700 ring-red-200',     Icon: ({ size = 12 }) => <AlertCircle size={size} /> },
  HIGH:     { cls: 'bg-orange-50 text-orange-700 ring-orange-200', Icon: ({ size = 12 }) => <AlertTriangle size={size} /> },
  MEDIUM:   { cls: 'bg-amber-50 text-amber-700 ring-amber-200',   Icon: ({ size = 12 }) => <AlertTriangle size={size} /> },
  LOW:      { cls: 'bg-emerald-50 text-emerald-700 ring-emerald-200', Icon: ({ size = 12 }) => <CheckCircle2 size={size} /> },
  INFO:     { cls: 'bg-blue-50 text-blue-700 ring-blue-200',    Icon: ({ size = 12 }) => <Info size={size} /> },
};

const STATUS_CONFIG: Record<string, { cls: string; Icon: (p: { size?: number }) => JSX.Element }> = {
  OPEN:        { cls: 'bg-red-50 text-red-700 ring-red-200',       Icon: ({ size = 12 }) => <RadioTower size={size} /> },
  IN_PROGRESS: { cls: 'bg-orange-50 text-orange-700 ring-orange-200', Icon: ({ size = 12 }) => <PlayCircle size={size} /> },
  ON_HOLD:     { cls: 'bg-amber-50 text-amber-700 ring-amber-200',    Icon: ({ size = 12 }) => <PauseCircle size={size} /> },
  RESOLVED:    { cls: 'bg-emerald-50 text-emerald-700 ring-emerald-200', Icon: ({ size = 12 }) => <CheckCircle2 size={size} /> },
  CLOSED:      { cls: 'bg-slate-100 text-slate-600 ring-slate-200',  Icon: ({ size = 12 }) => <XCircle size={size} /> },
};

const base = 'inline-flex items-center gap-1.5 rounded-full px-2.5 py-0.5 text-xs font-semibold ring-1';

export const SeverityBadge = memo(function SeverityBadge({ value }: { value?: string }) {
  const key = (value ?? 'INFO').toUpperCase();
  const cfg = SEVERITY_CONFIG[key] ?? SEVERITY_CONFIG.INFO;
  return <span className={`${base} ${cfg.cls}`}><cfg.Icon size={12} />{key}</span>;
});

export const StatusBadge = memo(function StatusBadge({ value }: { value?: string }) {
  const key = (value ?? 'OPEN').toUpperCase();
  const cfg = STATUS_CONFIG[key] ?? STATUS_CONFIG.OPEN;
  return (
    <span className={`${base} ${cfg.cls}`}>
      <cfg.Icon size={12} />
      {STATUS_LABELS[key as keyof typeof STATUS_LABELS] ?? key}
    </span>
  );
});
