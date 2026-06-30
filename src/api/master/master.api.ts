import { httpClient } from '@services/http/HttpClient';
import type { AlertStatus, Application, EventType, IncidentStatus, SeverityLevel } from '@master/types';
import { MASTER_ENDPOINTS } from './config/endpoints';

class MasterApi {
  async getApplications(): Promise<Application[]> {
    return httpClient.get(MASTER_ENDPOINTS.applications);
  }

  async getSeverityLevels(): Promise<SeverityLevel[]> {
    return httpClient.get(MASTER_ENDPOINTS.severityLevels);
  }

  async getEventTypes(): Promise<EventType[]> {
    return httpClient.get(MASTER_ENDPOINTS.eventTypes);
  }

  async getIncidentStatuses(): Promise<IncidentStatus[]> {
    return httpClient.get(MASTER_ENDPOINTS.incidentStatuses);
  }

  async getAlertStatuses(): Promise<AlertStatus[]> {
    return httpClient.get(MASTER_ENDPOINTS.alertStatuses);
  }
}

export const masterApi = new MasterApi();
