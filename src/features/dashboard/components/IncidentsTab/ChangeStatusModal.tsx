import { memo, useState, useCallback } from 'react';
import { X, Loader2 } from 'lucide-react';
import { Button } from '@shared/components/Button';
import { STATUS_LABELS } from '@config/constants';
import type { StatusType } from '@types/dashboard.types';

const TRANSITIONS: Record<string, StatusType[]> = {
  OPEN:        ['IN_PROGRESS', 'ON_HOLD'],
  IN_PROGRESS: ['ON_HOLD', 'RESOLVED'],
  ON_HOLD:     ['IN_PROGRESS'],
  RESOLVED:    ['CLOSED'],
  CLOSED:      [],
};

interface ChangeStatusModalProps {
  incidentId: string;
  incidentTitle: string;
  currentStatus: string;
  onConfirm: (incidentId: string, newStatus: string, reason: string) => Promise<void>;
  onClose: () => void;
}

const selectCls =
  'block w-full rounded-xl border border-slate-200 bg-white px-3 py-2 text-sm text-slate-700 shadow-sm focus:border-brand-500 focus:outline-none focus:ring-1 focus:ring-brand-500';

export const ChangeStatusModal = memo(function ChangeStatusModal({
  incidentId,
  incidentTitle,
  currentStatus,
  onConfirm,
  onClose,
}: ChangeStatusModalProps) {
  const allowed = TRANSITIONS[currentStatus.toUpperCase()] ?? [];
  const [newStatus, setNewStatus] = useState<string>(allowed[0] ?? '');
  const [reason, setReason] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = useCallback(async () => {
    if (!newStatus || !reason.trim()) {
      setError('Selecciona un estado y escribe una razón.');
      return;
    }
    setError(null);
    setIsSubmitting(true);
    try {
      await onConfirm(incidentId, newStatus, reason.trim());
      onClose();
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Error al cambiar estado');
    } finally {
      setIsSubmitting(false);
    }
  }, [incidentId, newStatus, reason, onConfirm, onClose]);

  if (allowed.length === 0) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-slate-900/50 backdrop-blur-sm" onClick={onClose} />

      <div className="relative w-full max-w-md rounded-2xl bg-white shadow-2xl">
        <div className="flex items-center justify-between border-b border-slate-100 px-6 py-4">
          <h2 className="font-semibold text-slate-900">Cambiar estado</h2>
          <button onClick={onClose} className="rounded-lg p-1.5 text-slate-400 hover:bg-slate-100">
            <X size={18} />
          </button>
        </div>

        <div className="space-y-4 px-6 py-5">
          <p className="text-sm text-slate-500 truncate">
            <span className="font-medium text-slate-700">{incidentTitle}</span>
          </p>

          <div className="space-y-1.5">
            <label className="text-xs font-semibold uppercase tracking-wide text-slate-500">
              Nuevo estado
            </label>
            <select
              value={newStatus}
              onChange={(e) => setNewStatus(e.target.value)}
              className={selectCls}
            >
              {allowed.map((s) => (
                <option key={s} value={s}>
                  {STATUS_LABELS[s] ?? s}
                </option>
              ))}
            </select>
          </div>

          <div className="space-y-1.5">
            <label className="text-xs font-semibold uppercase tracking-wide text-slate-500">
              Razón del cambio
            </label>
            <textarea
              rows={3}
              value={reason}
              onChange={(e) => setReason(e.target.value)}
              placeholder="Describe por qué cambia el estado..."
              className={`${selectCls} resize-none`}
            />
          </div>

          {error && (
            <p className="rounded-xl bg-red-50 px-4 py-2 text-sm text-red-600">{error}</p>
          )}
        </div>

        <div className="flex justify-end gap-2 border-t border-slate-100 px-6 py-4">
          <Button variant="secondary" size="sm" onClick={onClose} disabled={isSubmitting}>
            Cancelar
          </Button>
          <Button
            variant="primary"
            size="sm"
            onClick={handleSubmit}
            disabled={isSubmitting || !newStatus || !reason.trim()}
            icon={isSubmitting ? <Loader2 size={14} className="animate-spin" /> : undefined}
          >
            {isSubmitting ? 'Guardando...' : 'Confirmar'}
          </Button>
        </div>
      </div>
    </div>
  );
});
