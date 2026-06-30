import { httpClient } from '@services/http/HttpClient';
import { METRICS_ENDPOINTS } from './config/endpoints';

export interface MetricsDashboard {
  totalResolvedIncidents: number;
  totalOpenedIncidents: number;
  totalEvents: number;
  totalAlerts: number;
}

class MetricsApi {
  async getDashboard(): Promise<MetricsDashboard> {
    return httpClient.get(METRICS_ENDPOINTS.dashboard);
  }
}

export const metricsApi = new MetricsApi();
