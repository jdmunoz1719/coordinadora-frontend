export namespace Alert {
  export interface ItemList {
    applicationName?: string;
    sourceEventId?: string;
    severityName?: string;
    applicationId: string;
    statusName?: string;
    severityId: number;
    createdAt: string;
    statusId: number;
    id: string;
  }

  export interface ListAllFilters {
    applicationId?: string;
    severityId?: number;
    statusId?: number;
  }
}
