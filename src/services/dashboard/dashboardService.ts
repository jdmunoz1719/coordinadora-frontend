/**
 * Dashboard Service
 * Lógica de negocio específica del dashboard
 * Usa HttpClient centrali zado
 */

import { httpClient } from '@services/http/HttpClient';
import { wsManager } from '@services/websocket/WebSocketManager';
import { API_ENDPOINTS } from '@config/api.config';
import type {
  Incident,
  Alert,
  DashboardMetrics,
  FilterParams,
} from '@types/dashboard.types';
import type { PaginatedResponse, PaginationParams } from '@types/api.types';

export class DashboardService {
  /**
   * Obtiene lista de incidentes abiertos
   */
  async getOpenIncidents(
    pagination: PaginationParams & {
      applicationId?: string;
      statusId?: number;
      severity?: number;
    }
  ): Promise<PaginatedResponse<Incident>> {
    const params = new URLSearchParams();
    params.append('page', pagination.page.toString());
    params.append('limit', pagination.limit.toString());

    if (pagination.applicationId) {
      params.append('applicationId', pagination.applicationId);
    }
    if (pagination.statusId) {
      params.append('statusId', pagination.statusId.toString());
    }
    if (pagination.severity) {
      params.append('severity', pagination.severity.toString());
    }

    return httpClient.get(
      `${API_ENDPOINTS.incidents.list}?${params.toString()}`
    );
  }

  /**
   * Obtiene lista de incidentes resueltos
   */
  async getResolvedIncidents(
    pagination: PaginationParams
  ): Promise<PaginatedResponse<Incident>> {
    const params = new URLSearchParams();
    params.append('page', pagination.page.toString());
    params.append('limit', pagination.limit.toString());
    params.append('statusName', 'RESOLVED');

    return httpClient.get(
      `${API_ENDPOINTS.incidents.list}?${params.toString()}`
    );
  }

  /**
   * Obtiene lista de alertas
   */
  async getAlerts(
    pagination: PaginationParams & {
      severity?: number;
      applicationId?: string;
      statusId?: number;
      eventTypeId?: number;
    }
  ): Promise<PaginatedResponse<Alert>> {
    const params = new URLSearchParams();
    params.append('page', pagination.page.toString());
    params.append('limit', pagination.limit.toString());

    if (pagination.severity) {
      params.append('severity', pagination.severity.toString());
    }
    if (pagination.applicationId) {
      params.append('applicationId', pagination.applicationId);
    }
    if (pagination.statusId) {
      params.append('statusId', pagination.statusId.toString());
    }
    if (pagination.eventTypeId) {
      params.append('eventTypeId', pagination.eventTypeId.toString());
    }

    return httpClient.get(`${API_ENDPOINTS.alerts.list}?${params.toString()}`);
  }

  /**
   * Obtiene lista de eventos
   */
  async getEvents(
    pagination: PaginationParams & {
      applicationId?: string;
      severity?: number;
      eventTypeId?: number;
      dateFrom?: string;
      dateTo?: string;
    }
  ): Promise<PaginatedResponse<PaginationParams>> {
    const params = new URLSearchParams();
    params.append('page', pagination.page.toString());
    params.append('limit', pagination.limit.toString());

    if (pagination.applicationId) {
      params.append('applicationId', pagination.applicationId);
    }
    if (pagination.severity) {
      params.append('severity', pagination.severity.toString());
    }
    if (pagination.eventTypeId) {
      params.append('eventTypeId', pagination.eventTypeId.toString());
    }
    if (pagination.dateFrom) {
      params.append('dateFrom', pagination.dateFrom);
    }
    if (pagination.dateTo) {
      params.append('dateTo', pagination.dateTo);
    }

    return httpClient.get(`${API_ENDPOINTS.events.list}?${params.toString()}`);
  }

  /**
   * Obtiene contadores y agregados para el resumen
   */
  async getMetrics(): Promise<{
    totalOpenIncidents: number;
    totalResolvedIncidents: number;
    totalAlerts: number;
    totalEventsByApplication: Record<string, number>;
    totalEventsBySeverity: Record<string, number>;
  }> {
    try {
      return await httpClient.get(`${API_ENDPOINTS.incidents.list}/metrics`);
    } catch {
      return {
        totalOpenIncidents: 0,
        totalResolvedIncidents: 0,
        totalAlerts: 0,
        totalEventsByApplication: {},
        totalEventsBySeverity: {},
      };
    }
  }

  /**
   * Calcula métricas del dashboard (legado)
   */
  async calculateMetrics(
    openIncidents: Incident[],
    resolvedIncidents: Incident[],
    alerts: Alert[]
  ): Promise<DashboardMetrics> {
    return {
      totalOpenIncidents: openIncidents.length,
      totalResolvedIncidents: resolvedIncidents.length,
      totalAlerts: alerts.length,
      criticalIncidents: openIncidents.filter(
        (i) => i.severityName === 'CRITICAL'
      ).length,
    };
  }

  /**
   * Agrupa eventos por aplicación
   */
  aggregateEventsByApplication(
    events: any[]
  ): Record<string, number> {
    return events.reduce(
      (acc, event) => {
        const appName = event.applicationName || 'Unknown';
        acc[appName] = (acc[appName] || 0) + 1;
        return acc;
      },
      {} as Record<string, number>
    );
  }

  /**
   * Agrupa eventos por severidad
   */
  aggregateEventsBySeverity(
    events: any[]
  ): Record<string, number> {
    return events.reduce(
      (acc, event) => {
        const severity = event.severityName || 'INFO';
        acc[severity] = (acc[severity] || 0) + 1;
        return acc;
      },
      {} as Record<string, number>
    );
  }

  async updateIncidentStatus(
    id: string,
    newStatus: string,
    reason: string,
  ): Promise<Incident> {
    const socketId = wsManager.getSocketId();
    return httpClient.patch<Incident>(
      API_ENDPOINTS.incidents.updateStatus(id),
      { newStatus, reason },
      socketId ? { headers: { 'x-socket-id': socketId } } : undefined,
    );
  }
}

export const dashboardService = new DashboardService();
