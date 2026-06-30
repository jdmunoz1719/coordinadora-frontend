export namespace Event {
  export interface ItemList {
    applicationName: string;
    applicationId: string;
    eventTypeName: string;
    severityName: string;
    severityColor?: string;
    eventTypeId: number;
    description: string;
    occurredAt: string;
    severityId: number;
    createdAt: string;
    traceId: string;
    id: string;
  }

  export interface ListAllFilters {
    applicationId?: string;
    eventTypeId?: number;
    severityId?: number;
    occurredAt?: string;
  }

  export interface TotalByApplication {
    applicationName: string;
    totalEvents: number;
  }

  export interface TotalBySeverity {
    severityName: string;
    totalEvents: number;
    color: string;
  }
}
