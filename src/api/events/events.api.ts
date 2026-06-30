import { PaginatedResponse, PaginationParams } from "@api/api.interface";
import { Event } from "@events/interface/event.interface";
import { httpClient } from "@services/http/HttpClient";
import { EVENTS_ENDPOINTS } from "./config/endpoints";

class EventsApi {
  async getAll(
    pagination: PaginationParams & Event.ListAllFilters,
  ): Promise<PaginatedResponse<Event.ItemList>> {
    const params = new URLSearchParams();
    params.append("page", pagination.page.toString());
    params.append("limit", pagination.limit.toString());
    if (pagination.applicationId)
      params.append("applicationId", pagination.applicationId);
    if (pagination.eventTypeId)
      params.append("eventTypeId", pagination.eventTypeId.toString());
    if (pagination.severityId)
      params.append("severityId", pagination.severityId.toString());
    if (pagination.occurredAt)
      params.append("occurredAt", pagination.occurredAt);
    return httpClient.get(`${EVENTS_ENDPOINTS.list}?${params.toString()}`);
  }

  async getTotalByApplication(): Promise<Event.TotalByApplication[]> {
    return httpClient.get(EVENTS_ENDPOINTS.listTotalByApplication);
  }

  async getTotalBySeverity(): Promise<Event.TotalBySeverity[]> {
    return httpClient.get(EVENTS_ENDPOINTS.listTotalBySeverity);
  }
}

export const eventsApi = new EventsApi();
