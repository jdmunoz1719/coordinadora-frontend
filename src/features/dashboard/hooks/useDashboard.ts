import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { dashboardService } from '@services/dashboard/dashboardService';
import { wsManager } from '@services/websocket/WebSocketManager';
import { WS_MESSAGE_TYPES, WS_CHANNELS } from '@config/ws.config';
import {
  useDashboardStore,
  selectIncidents,
  selectAlerts,
  selectMetrics,
  selectEventsByApplication,
  selectEventsBySeverity,
  selectIsLoading,
  selectError,
  selectLastUpdated,
} from '@store/dashboardStore';
import type { FilterParams } from '@types/dashboard.types';
import { PAGINATION } from '@config/constants';

interface UseDashboardOptions {
  filters?: FilterParams;
}

export function useDashboard(options?: UseDashboardOptions) {
  const incidents           = useDashboardStore(selectIncidents);
  const alerts              = useDashboardStore(selectAlerts);
  const metrics             = useDashboardStore(selectMetrics);
  const eventsByApplication = useDashboardStore(selectEventsByApplication);
  const eventsBySeverity    = useDashboardStore(selectEventsBySeverity);
  const isLoading           = useDashboardStore(selectIsLoading);
  const error               = useDashboardStore(selectError);
  const lastUpdated         = useDashboardStore(selectLastUpdated);

  const [wsConnected, setWsConnected] = useState(false);

  const filtersKey = useMemo(
    () => JSON.stringify(options?.filters ?? {}),
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [JSON.stringify(options?.filters)],
  );

  const loadDashboard = useCallback(async () => {
    const store = useDashboardStore.getState();
    try {
      store.setLoading(true);
      store.setError(null);

      const filters: FilterParams = JSON.parse(filtersKey);
      const [openIncidents, resolvedIncidents, alertsRes] = await Promise.all([
        dashboardService.getOpenIncidents(
          { page: PAGINATION.DEFAULT_PAGE, limit: PAGINATION.MAX_LIMIT },
          filters,
        ),
        dashboardService.getResolvedIncidents({ page: PAGINATION.DEFAULT_PAGE, limit: PAGINATION.MAX_LIMIT }),
        dashboardService.getAlerts({ page: PAGINATION.DEFAULT_PAGE, limit: PAGINATION.DEFAULT_LIMIT }),
      ]);

      store.setIncidents(openIncidents.items);
      store.setAlerts(alertsRes.items);
      store.setMetrics(await dashboardService.calculateMetrics(openIncidents.items, resolvedIncidents.items, alertsRes.items));
      store.setEventsByApplication(dashboardService.aggregateEventsByApplication(openIncidents.items));
      store.setEventsBySeverity(dashboardService.aggregateEventsBySeverity(openIncidents.items));
    } catch (err) {
      useDashboardStore.getState().setError(err instanceof Error ? err.message : 'Error cargando dashboard');
    } finally {
      useDashboardStore.getState().setLoading(false);
    }
  }, [filtersKey]);

  const wsRef = useRef(false);

  useEffect(() => {
    if (wsRef.current) return;
    wsRef.current = true;

    const { addIncident, updateIncident, addAlert } = useDashboardStore.getState();

    wsManager.connect()
      .then(() => {
        setWsConnected(true);
        wsManager.subscribeToChannel(WS_CHANNELS.DASHBOARD);

        wsManager.on(WS_MESSAGE_TYPES.INCIDENT_CREATED, addIncident);
        wsManager.on(WS_MESSAGE_TYPES.INCIDENT_UPDATED, updateIncident);
        wsManager.on(WS_MESSAGE_TYPES.ALERT_CREATED, addAlert);

        // Evento crítico: recargar dashboard completo para reflejar nuevas métricas
        wsManager.on('event:critical', () => {
          useDashboardStore.getState().setLoading(false);
          loadDashboard();
        });

        wsManager.onConnected(() => setWsConnected(true));
        wsManager.onDisconnected(() => setWsConnected(false));
      })
      .catch(() => setWsConnected(false));

    return () => {
      wsManager.unsubscribeFromChannel(WS_CHANNELS.DASHBOARD);
      wsRef.current = false;
    };
  }, [loadDashboard]);

  // Carga inicial — debounce 10ms absorbe el doble-invoke de StrictMode en dev
  useEffect(() => {
    const t = setTimeout(loadDashboard, 10);
    return () => clearTimeout(t);
  }, [loadDashboard]);

  return {
    incidents,
    alerts,
    metrics,
    eventsByApplication,
    eventsBySeverity,
    isLoading,
    error,
    lastUpdated,
    wsConnected,
    refresh: loadDashboard,
  };
}
