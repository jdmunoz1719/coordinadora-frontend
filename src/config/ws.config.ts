/**
 * Configuración centralizada de WebSockets
 */

import type { WebSocketConfig } from '@/api/api.interface';

const WS_URL = import.meta.env.VITE_WS_URL || 'ws://localhost:3001';
const WS_RECONNECT_INTERVAL = parseInt(
  import.meta.env.VITE_WS_RECONNECT_INTERVAL || '5000',
  10
);
const WS_MAX_RETRIES = parseInt(import.meta.env.VITE_WS_MAX_RETRIES || '5', 10);

export const wsConfig: WebSocketConfig = {
  url: WS_URL,
  reconnectInterval: WS_RECONNECT_INTERVAL,
  maxRetries: WS_MAX_RETRIES,
};

/**
 * Tipos de mensajes WebSocket
 */
export const WS_MESSAGE_TYPES = {
  // Subscripciones
  SUBSCRIBE: 'subscribe',
  UNSUBSCRIBE: 'unsubscribe',

  // Eventos de incidentes
  INCIDENT_CREATED: 'incident:created',
  INCIDENT_UPDATED: 'incident:updated',

  // Eventos de alertas
  ALERT_CREATED: 'alert:created',

  // Eventos de conexión
  CONNECTED: 'connected',
  DISCONNECTED: 'disconnected',
  ERROR: 'error',
} as const;

/**
 * Canales/Rooms de WebSocket
 */
export const WS_CHANNELS = {
  DASHBOARD: 'dashboard',
  INCIDENTS: 'incidents',
  EVENTS: 'events',
  ALERTS: 'alerts',
} as const;

