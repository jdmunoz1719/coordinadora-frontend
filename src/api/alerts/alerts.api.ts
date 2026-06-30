import { Alert } from "@alerts/interfaces/alert.interface";
import { PaginatedResponse, PaginationParams } from "@api/api.interface";
import { httpClient } from "@services/http/HttpClient";
import { ALERTS_ENDPOINTS } from "./config/endpoints";

class AlertsApi {
  async getAll(
    pagination: PaginationParams & Alert.ListAllFilters,
  ): Promise<PaginatedResponse<Alert.ItemList>> {
    const params = new URLSearchParams();
    params.append("page", pagination.page.toString());
    params.append("limit", pagination.limit.toString());
    if (pagination.severityId)
      params.append("severityId", pagination.severityId.toString());
    if (pagination.applicationId)
      params.append("applicationId", pagination.applicationId);
    if (pagination.statusId)
      params.append("statusId", pagination.statusId.toString());
    return httpClient.get(`${ALERTS_ENDPOINTS.list}?${params.toString()}`);
  }
}

export const alertsApi = new AlertsApi();
