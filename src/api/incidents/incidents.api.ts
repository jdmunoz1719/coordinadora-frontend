import type { PaginatedResponse, PaginationParams } from "@api/api.interface";
import { Incident } from "@incidents/interfaces/incident.interface";
import { httpClient } from "@services/http/HttpClient";
import { INCIDENTS_ENDPOINTS } from "./config/endpoints";

export interface OpenIncidentsFilters {
  applicationId?: string;
  severityId?: number;
}

class IncidentsApi {
  async getAll(
    pagination: PaginationParams & Incident.ListAllFilters,
  ): Promise<PaginatedResponse<Incident.ItemList>> {
    const params = new URLSearchParams();
    params.append("page", pagination.page.toString());
    params.append("limit", pagination.limit.toString());
    if (pagination.applicationId)
      params.append("applicationId", pagination.applicationId);
    if (pagination.statusId)
      params.append("statusId", pagination.statusId.toString());
    if (pagination.severityId)
      params.append("severityId", pagination.severityId.toString());
    return httpClient.get(`${INCIDENTS_ENDPOINTS.list}?${params.toString()}`);
  }

  async getOpen(
    pagination: PaginationParams & OpenIncidentsFilters,
  ): Promise<PaginatedResponse<Incident.ItemList>> {
    const params = new URLSearchParams();
    params.append("page", pagination.page.toString());
    params.append("limit", pagination.limit.toString());
    if (pagination.applicationId)
      params.append("applicationId", pagination.applicationId);
    if (pagination.severityId)
      params.append("severityId", pagination.severityId.toString());
    return httpClient.get(`${INCIDENTS_ENDPOINTS.open}?${params.toString()}`);
  }
}

export const incidentsApi = new IncidentsApi();
