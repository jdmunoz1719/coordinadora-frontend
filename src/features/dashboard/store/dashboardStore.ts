import { Alert } from "@alerts/interfaces/alert.interface";
import { Event } from "@events/interface/event.interface";
import { Incident } from "@incidents/interfaces/incident.interface";
import type {
  AlertStatus,
  Application,
  EventType,
  IncidentStatus,
  SeverityLevel,
} from "@master/types";
import { create } from "zustand";
import { devtools } from "zustand/middleware";

interface DashboardState {
  incidents: Incident.ItemList[];
  alerts: Alert.ItemList[];
  events: Event.ItemList[];
  // metrics: IncidentMetrics | null;
  eventsByApplication: Event.TotalByApplication[];
  eventsBySeverity: Event.TotalBySeverity[];
  isLoading: boolean;
  error: string | null;
  lastUpdated: string | null;
  applications?: Application[];
  severityLevels?: SeverityLevel[];
  eventTypes?: EventType[];
  alertStatuses?: AlertStatus[];
  incidentStatuses?: IncidentStatus[];
}

interface DashboardActions {
  setIncidents: (items: Incident.ItemList[]) => void;
  setAlerts: (items: Alert.ItemList[]) => void;
  setEvents: (items: Event.ItemList[]) => void;
  // setMetrics: (metrics: IncidentMetrics) => void;
  setEventsByApplication: (data: Event.TotalByApplication[]) => void;
  setEventsBySeverity: (data: Event.TotalBySeverity[]) => void;
  setApplications: (apps: Application[]) => void;
  setSeverityLevels: (levels: SeverityLevel[]) => void;
  setEventTypes: (types: EventType[]) => void;
  setIncidentStatuses: (statuses: IncidentStatus[]) => void;
  setAlertStatuses: (statuses: AlertStatus[]) => void;
  setLoading: (loading: boolean) => void;
  setError: (error: string | null) => void;
  reset: () => void;
}

const initial: DashboardState = {
  incidents: [],
  alerts: [],
  events: [],
  // metrics: null,
  eventsByApplication: [],
  eventsBySeverity: [],
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
        set({ incidents: items, lastUpdated: ts() }, false, "setIncidents"),

      setAlerts: (items) =>
        set({ alerts: items, lastUpdated: ts() }, false, "setAlerts"),

      setEvents: (items) =>
        set({ events: items, lastUpdated: ts() }, false, "setEvents"),

      // setMetrics: (metrics) =>
      //   set({ metrics, lastUpdated: ts() }, false, 'setMetrics'),

      setEventsByApplication: (data) =>
        set({ eventsByApplication: data }, false, "setEventsByApplication"),

      setEventsBySeverity: (data) =>
        set({ eventsBySeverity: data }, false, "setEventsBySeverity"),

      setApplications: (applications) =>
        set({ applications }, false, "setApplications"),

      setSeverityLevels: (severityLevels) =>
        set({ severityLevels }, false, "setSeverityLevels"),

      setEventTypes: (eventTypes) =>
        set({ eventTypes }, false, "setEventTypes"),

      setIncidentStatuses: (incidentStatuses) =>
        set({ incidentStatuses }, false, "setIncidentStatuses"),

      setAlertStatuses: (alertStatuses) =>
        set({ alertStatuses }, false, "setAlertStatuses"),

      setLoading: (isLoading) => set({ isLoading }, false, "setLoading"),

      setError: (error) => set({ error }, false, "setError"),

      reset: () => set(initial, false, "reset"),
    }),
    { name: "dashboard" },
  ),
);

export const selectIncidents = (s: DashboardState & DashboardActions) =>
  s.incidents;
export const selectAlerts = (s: DashboardState & DashboardActions) => s.alerts;
// export const selectMetrics = (s: DashboardState & DashboardActions) =>
//   s.metrics;
export const selectEventsByApplication = (
  s: DashboardState & DashboardActions,
) => s.eventsByApplication;
export const selectEventsBySeverity = (s: DashboardState & DashboardActions) =>
  s.eventsBySeverity;
export const selectIsLoading = (s: DashboardState & DashboardActions) =>
  s.isLoading;
export const selectError = (s: DashboardState & DashboardActions) => s.error;
export const selectLastUpdated = (s: DashboardState & DashboardActions) =>
  s.lastUpdated;
