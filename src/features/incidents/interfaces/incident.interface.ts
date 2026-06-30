export namespace Incident {
  export interface ItemList {
    applicationName?: string;
    assignedToName?: string;
    applicationId: string;
    severityName?: string;
    severityColor?: string;
    assignedToId?: string;
    statusColor?: string;
    description: string;
    statusName?: string;
    severityId: number;
    createdAt: string;
    statusId: number;
    title: string;
    id: string;
  }

  export interface ListAllFilters {
    applicationId?: string;
    statusId?: number;
    severityId?: number;
  }

  export interface IncidentMetrics {
    totalEventsByApplication: Record<string, number>;
    totalEventsBySeverity: Record<string, number>;
    totalResolvedIncidents: number;
    totalOpenIncidents: number;
    totalAlerts: number;
  }
}
