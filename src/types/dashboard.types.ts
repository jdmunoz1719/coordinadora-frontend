/**
 * Domain types for dashboard feature
 */

export type SeverityType = 'CRITICAL' | 'HIGH' | 'MEDIUM' | 'LOW' | 'INFO';
export type StatusType = 'OPEN' | 'IN_PROGRESS' | 'ON_HOLD' | 'RESOLVED' | 'CLOSED';

export interface Incident {
  id: string;
  title: string;
  description: string;
  applicationId: string;
  applicationName?: string;
  severityId: number;
  severityName?: SeverityType;
  statusName?: StatusType;
  assignedToId?: string;
  assignedToName?: string;
  createdById: string;
  createdByName?: string;
  createdAt: string;
}

export interface Alert {
  id: string;
  sourceEventId?: string;
  severityId: number;
  severityName?: SeverityType;
  statusId: number;
  statusName?: string;
  applicationId: string;
  applicationName?: string;
  createdAt: string;
}

export interface DashboardMetrics {
  totalOpenIncidents: number;
  totalResolvedIncidents: number;
  totalAlerts: number;
  criticalIncidents: number;
}

export interface EventsByApplication {
  [applicationName: string]: number;
}

export interface EventsBySeverity {
  [severity in SeverityType]: number;
}

export interface DashboardState {
  incidents: Incident[];
  alerts: Alert[];
  metrics: DashboardMetrics | null;
  eventsByApplication: EventsByApplication;
  eventsBySeverity: EventsBySeverity;
  isLoading: boolean;
  error: string | null;
  lastUpdated: string | null;
}

export interface FilterParams {
  applicationId?: string;
  startDate?: string;
  endDate?: string;
  statusName?: StatusType;
  severityName?: SeverityType;
}
