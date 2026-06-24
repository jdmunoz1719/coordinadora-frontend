import { useState, useCallback, useEffect, useRef } from 'react';
import { dashboardService } from '@services/dashboard/dashboardService';
import { wsManager } from '@services/websocket/WebSocketManager';
import { useDashboardStore } from '@store/dashboardStore';
import type { TabId } from '../components/TabBar';
import type { AlertFiltersState } from '../components/AlertsTab';
import type { IncidentsFiltersState } from '../components/IncidentsTab';
import type { EventsFiltersState } from '../components/EventsTab';
import { PAGINATION } from '@config/constants';

const TAB_EVENTS: Record<TabId, string[]> = {
  resumen:    ['incident:created', 'incident:status_updated', 'alert:created', 'event:critical'],
  incidentes: ['incident:created', 'incident:status_updated'],
  alertas:    ['alert:created'],
  eventos:    ['event:critical'],
};

type AnyFn = (...args: any[]) => void;

interface PaginationState {
  page: number;
  limit: number;
  total: number;
}

export function useTabManager() {
  const [activeTab, setActiveTab] = useState<TabId>('resumen');
  const [isLoading, setIsLoading] = useState(false);
  const [wsConnected, setWsConnected] = useState(false);
  const [counts, setCounts] = useState<Record<TabId, number>>({
    resumen: 0,
    incidentes: 0,
    alertas: 0,
    eventos: 0,
  });

  // Paginación por tab
  const [pagination, setPagination] = useState<Record<TabId, PaginationState>>({
    resumen:    { page: PAGINATION.DEFAULT_PAGE, limit: PAGINATION.DEFAULT_LIMIT, total: 0 },
    incidentes: { page: PAGINATION.DEFAULT_PAGE, limit: PAGINATION.DEFAULT_LIMIT, total: 0 },
    alertas:    { page: PAGINATION.DEFAULT_PAGE, limit: PAGINATION.DEFAULT_LIMIT, total: 0 },
    eventos:    { page: PAGINATION.DEFAULT_PAGE, limit: PAGINATION.DEFAULT_LIMIT, total: 0 },
  });

  // Filtros de alertas, incidentes y eventos
  const [alertFilters, setAlertFilters] = useState<AlertFiltersState>({});
  const [incidentFilters, setIncidentFilters] = useState<IncidentsFiltersState>({});
  const [eventFilters, setEventFilters] = useState<EventsFiltersState>({});

  const activeHandlers = useRef<Map<string, AnyFn>>(new Map());
  const wsReady = useRef(false);
  const currentTab = useRef<TabId>('resumen');

  // ─── Data loaders ────────────────────────────────────────────────────────────
  const loadIncidents = useCallback(async (page: number, limit: number) => {
    const res = await dashboardService.getOpenIncidents({
      page,
      limit,
      ...incidentFilters,
    });
    useDashboardStore.getState().setIncidents(res.items);
    setPagination((p) => ({ ...p, incidentes: { page, limit, total: res.total } }));
    setCounts((c) => ({ ...c, incidentes: res.total }));
  }, [incidentFilters]);

  const loadAlerts = useCallback(async (page: number, limit: number) => {
    const res = await dashboardService.getAlerts({
      page,
      limit,
      ...alertFilters,
    });
    useDashboardStore.getState().setAlerts(res.items);
    setPagination((p) => ({ ...p, alertas: { page, limit, total: res.total } }));
    setCounts((c) => ({ ...c, alertas: res.total }));
  }, [alertFilters]);

  const loadEvents = useCallback(async (page: number, limit: number) => {
    const res = await dashboardService.getEvents({
      page,
      limit,
      ...eventFilters,
    });
    useDashboardStore.getState().setEvents(res.items);
    setPagination((p) => ({ ...p, eventos: { page, limit, total: res.total } }));
    setCounts((c) => ({ ...c, eventos: res.total }));
  }, [eventFilters]);

  const loadResumen = useCallback(async () => {
    const metrics = await dashboardService.getMetrics();
    const s = useDashboardStore.getState();
    s.setMetrics({
      totalOpenIncidents: metrics.totalOpenIncidents,
      totalResolvedIncidents: metrics.totalResolvedIncidents,
      totalAlerts: metrics.totalAlerts,
      criticalIncidents: 0,
    });
    s.setEventsByApplication(metrics.totalEventsByApplication);
    s.setEventsBySeverity(metrics.totalEventsBySeverity);
    setCounts((p) => ({
      ...p,
      incidentes: metrics.totalOpenIncidents,
      alertas: metrics.totalAlerts,
    }));
  }, []);

  const LOADERS: Record<TabId, (page?: number, limit?: number) => Promise<void>> = {
    incidentes: loadIncidents,
    alertas:    loadAlerts,
    resumen:    loadResumen,
    eventos:    loadEvents,
  };

  const loadTab = useCallback(
    async (tab: TabId, page?: number, limit?: number) => {
      setIsLoading(true);
      useDashboardStore.getState().setError(null);
      try {
        if (tab === 'resumen') {
          await LOADERS[tab]();
        } else {
          const p = page ?? pagination[tab].page;
          const l = limit ?? pagination[tab].limit;
          await LOADERS[tab](p, l);
        }
      } catch (err) {
        useDashboardStore.getState().setError(
          err instanceof Error ? err.message : 'Error cargando datos',
        );
      } finally {
        setIsLoading(false);
      }
    },
    [pagination, loadIncidents, loadAlerts, loadResumen, loadEvents],
  );

  // ─── Pagination handlers ──────────────────────────────────────────────────────
  const handlePageChange = useCallback(
    (page: number) => {
      setPagination((p) => ({ ...p, [currentTab.current]: { ...p[currentTab.current], page } }));
      loadTab(currentTab.current, page, undefined);
    },
    [loadTab],
  );

  const handleLimitChange = useCallback(
    (limit: number) => {
      setPagination((p) => ({
        ...p,
        [currentTab.current]: { ...p[currentTab.current], limit, page: PAGINATION.DEFAULT_PAGE },
      }));
      loadTab(currentTab.current, PAGINATION.DEFAULT_PAGE, limit);
    },
    [loadTab],
  );

  const handleAlertFiltersChange = useCallback(
    (filters: AlertFiltersState) => {
      setAlertFilters(filters);
      setPagination((p) => ({
        ...p,
        alertas: { ...p.alertas, page: PAGINATION.DEFAULT_PAGE },
      }));
      loadTab('alertas', PAGINATION.DEFAULT_PAGE, pagination.alertas.limit);
    },
    [pagination.alertas.limit, loadTab],
  );

  const handleIncidentFiltersChange = useCallback(
    (filters: IncidentsFiltersState) => {
      setIncidentFilters(filters);
      setPagination((p) => ({
        ...p,
        incidentes: { ...p.incidentes, page: PAGINATION.DEFAULT_PAGE },
      }));
      loadTab('incidentes', PAGINATION.DEFAULT_PAGE, pagination.incidentes.limit);
    },
    [pagination.incidentes.limit, loadTab],
  );

  const handleEventFiltersChange = useCallback(
    (filters: EventsFiltersState) => {
      setEventFilters(filters);
      setPagination((p) => ({
        ...p,
        eventos: { ...p.eventos, page: PAGINATION.DEFAULT_PAGE },
      }));
      loadTab('eventos', PAGINATION.DEFAULT_PAGE, pagination.eventos.limit);
    },
    [pagination.eventos.limit, loadTab],
  );

  // ─── WS subscription management ─────────────────────────────────────────────
  const unsubscribeCurrent = useCallback(() => {
    activeHandlers.current.forEach((fn, event) => wsManager.off(event, fn));
    activeHandlers.current.clear();
  }, []);

  const subscribeTab = useCallback((tab: TabId) => {
    const s = useDashboardStore.getState;

    const buildHandlers = (): Map<string, AnyFn> => {
      const map = new Map<string, AnyFn>();

      if (tab === 'incidentes') {
        const onCreated: AnyFn = () => {
          setCounts((p) => ({ ...p, incidentes: p.incidentes + 1 }));
        };
        map.set('incident:created', onCreated);
      } else if (tab === 'alertas') {
        const onCreated: AnyFn = () => {
          setCounts((p) => ({ ...p, alertas: p.alertas + 1 }));
        };
        map.set('alert:created', onCreated);
      } else {
        const reload: AnyFn = () => loadTab(tab);
        for (const ev of TAB_EVENTS.resumen) map.set(ev, reload);
      }
      return map;
    };

    const handlers = buildHandlers();
    handlers.forEach((fn, event) => wsManager.on(event, fn));
    activeHandlers.current = handlers;
  }, [loadTab]);

  // ─── Tab switch ──────────────────────────────────────────────────────────────
  const switchTab = useCallback(
    (newTab: TabId) => {
      if (newTab === currentTab.current) return;
      unsubscribeCurrent();
      currentTab.current = newTab;
      setActiveTab(newTab);
      loadTab(newTab);
      if (wsReady.current) subscribeTab(newTab);
    },
    [unsubscribeCurrent, loadTab, subscribeTab],
  );

  // ─── Init: WS connect + initial load ────────────────────────────────────────
  useEffect(() => {
    wsManager.connect()
      .then(() => {
        wsReady.current = true;
        setWsConnected(true);
        wsManager.subscribeToChannel('dashboard');
        wsManager.onConnected(() => setWsConnected(true));
        wsManager.onDisconnected(() => setWsConnected(false));
        subscribeTab(currentTab.current);
      })
      .catch(() => setWsConnected(false));

    const t = setTimeout(() => loadTab(currentTab.current), 10);

    return () => {
      clearTimeout(t);
      unsubscribeCurrent();
    };
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const activePagination = pagination[activeTab];

  return {
    activeTab,
    switchTab,
    isLoading,
    wsConnected,
    counts,
    pagination: activePagination,
    onPageChange: handlePageChange,
    onLimitChange: handleLimitChange,
    alertFilters,
    onAlertFiltersChange: handleAlertFiltersChange,
    incidentFilters,
    onIncidentFiltersChange: handleIncidentFiltersChange,
    eventFilters,
    onEventFiltersChange: handleEventFiltersChange,
    refresh: () => loadTab(currentTab.current),
  };
}
