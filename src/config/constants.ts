/**
 * Constantes globales reutilizables
 */

export const SEVERITY_LEVELS = {
  CRITICAL: 'CRITICAL',
  HIGH: 'HIGH',
  MEDIUM: 'MEDIUM',
  LOW: 'LOW',
  INFO: 'INFO',
} as const;

export const SEVERITY_COLORS = {
  CRITICAL: '#dc2626',
  HIGH: '#ea580c',
  MEDIUM: '#eab308',
  LOW: '#22c55e',
  INFO: '#3b82f6',
} as const;

export const STATUS_LABELS = {
  OPEN: 'Abierto',
  IN_PROGRESS: 'En Progreso',
  ON_HOLD: 'En Pausa',
  RESOLVED: 'Resuelto',
  CLOSED: 'Cerrado',
} as const;

export const STATUS_COLORS = {
  OPEN: '#ef4444',
  IN_PROGRESS: '#f97316',
  ON_HOLD: '#eab308',
  RESOLVED: '#22c55e',
  CLOSED: '#6b7280',
} as const;

export const PAGINATION = {
  DEFAULT_PAGE: 1,
  DEFAULT_LIMIT: 20,
  MAX_LIMIT: 100,
} as const;

export const DATE_FORMAT = {
  DISPLAY: 'dd MMM yyyy HH:mm',
  ISO: "yyyy-MM-dd'T'HH:mm:ss.SSSxxx",
  DATE_ONLY: 'yyyy-MM-dd',
} as const;

export const MESSAGES = {
  LOADING: 'Cargando...',
  ERROR: 'Error al cargar datos',
  NO_DATA: 'No hay datos disponibles',
  RETRY: 'Reintentar',
} as const;

export const ANIMATION = {
  DURATION_FAST: 150,
  DURATION_NORMAL: 300,
  DURATION_SLOW: 500,
} as const;
