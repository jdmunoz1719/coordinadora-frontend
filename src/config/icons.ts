/**
 * Mapa central de iconos e ilustraciones reutilizables.
 * - Material Symbols (nombres) para iconos de UI.
 * - Flaticon (PNG CDN) para logo e ilustraciones de estados vacíos.
 */

// Ilustraciones Flaticon (con fallback a Material en <FlatIcon/>)
export const ILLUSTRATIONS = {
  logo: 'https://cdn-icons-png.flaticon.com/512/3209/3209265.png',
  emptyData: 'https://cdn-icons-png.flaticon.com/512/7486/7486744.png',
  noAlerts: 'https://cdn-icons-png.flaticon.com/512/2098/2098402.png',
  allClear: 'https://cdn-icons-png.flaticon.com/512/845/845646.png',
} as const;

// Icono Material por severidad
export const SEVERITY_ICONS: Record<string, string> = {
  CRITICAL: 'error',
  HIGH: 'warning',
  MEDIUM: 'report_problem',
  LOW: 'info',
  INFO: 'lightbulb',
};

// Icono Material por estado de incidente
export const STATUS_ICONS: Record<string, string> = {
  OPEN: 'radio_button_checked',
  IN_PROGRESS: 'autorenew',
  ON_HOLD: 'pause_circle',
  RESOLVED: 'check_circle',
  CLOSED: 'cancel',
};
