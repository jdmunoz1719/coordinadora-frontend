import { create } from 'zustand';
import { devtools } from 'zustand/middleware';
import type { Alert, DashboardMetrics, Incident, Event } from '@types/dashboard.types';

interface DashboardState {
  incidents: Incident[];
  alerts: Alert[];
  events: Event[];
  metrics: DashboardMetrics | null;
  eventsByApplication: Record<string, number>;
  eventsBySeverity: Record<string, number>;
  isLoading: boolean;
  error: string | null;
  lastUpdated: string | null;
}

interface DashboardActions {
  setIncidents: (items: Incident[]) => void;
  addIncident: (item: Incident) => void;
  updateIncident: (item: Incident) => void;
  setAlerts: (items: Alert[]) => void;
  addAlert: (item: Alert) => void;
  setEvents: (items: Event[]) => void;
  setMetrics: (metrics: DashboardMetrics) => void;
  setEventsByApplication: (data: Record<string, number>) => void;
  setEventsBySeverity: (data: Record<string, number>) => void;
  setLoading: (loading: boolean) => void;
  setError: (error: string | null) => void;
  reset: () => void;
}

const initial: DashboardState = {
  incidents: [],
  alerts: [],
  events: [],
  metrics: null,
  eventsByApplication: {},
  eventsBySeverity: {},
  isLoading: false,
  error: null,
  lastUpdated: null,
};

const ts = () => new Date().toISOString();

export const useDashboardStore = create<DashboardState & DashboardActions>()(
  devtools(
    (set) => ({
      ...initial,

      setIncidents: (items) =>
        set({ incidents: items, lastUpdated: ts() }, false, 'setIncidents'),

      addIncident: (item) =>
        set((s) => ({ incidents: [item, ...s.incidents], lastUpdated: ts() }), false, 'addIncident'),

      updateIncident: (item) =>
        set(
          (s) => ({
            incidents: s.incidents.map((i) => (i.id === item.id ? item : i)),
            lastUpdated: ts(),
          }),
          false,
          'updateIncident',
        ),

      setAlerts: (items) =>
        set({ alerts: items, lastUpdated: ts() }, false, 'setAlerts'),

      addAlert: (item) =>
        set((s) => ({ alerts: [item, ...s.alerts], lastUpdated: ts() }), false, 'addAlert'),

      setEvents: (items) =>
        set({ events: items, lastUpdated: ts() }, false, 'setEvents'),

      setMetrics: (metrics) =>
        set({ metrics, lastUpdated: ts() }, false, 'setMetrics'),

      setEventsByApplication: (data) =>
        set({ eventsByApplication: data }, false, 'setEventsByApplication'),

      setEventsBySeverity: (data) =>
        set({ eventsBySeverity: data }, false, 'setEventsBySeverity'),

      setLoading: (isLoading) =>
        set({ isLoading }, false, 'setLoading'),

      setError: (error) =>
        set({ error }, false, 'setError'),

      reset: () => set(initial, false, 'reset'),
    }),
    { name: 'dashboard' },
  ),
);

// Selectores atómicos — cada componente suscribe solo lo que necesita
export const selectIncidents = (s: DashboardState & DashboardActions) => s.incidents;
export const selectAlerts = (s: DashboardState & DashboardActions) => s.alerts;
export const selectMetrics = (s: DashboardState & DashboardActions) => s.metrics;
export const selectEventsByApplication = (s: DashboardState & DashboardActions) => s.eventsByApplication;
export const selectEventsBySeverity = (s: DashboardState & DashboardActions) => s.eventsBySeverity;
export const selectIsLoading = (s: DashboardState & DashboardActions) => s.isLoading;
export const selectError = (s: DashboardState & DashboardActions) => s.error;
export const selectLastUpdated = (s: DashboardState & DashboardActions) => s.lastUpdated;
