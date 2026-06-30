/**
 * HTTP API types and response formats
 */

export interface PaginationParams {
  page: number;
  limit: number;
}

export interface ApiResponse<T> {
  data: T;
  status: number;
  message?: string;
}

export interface PaginatedResponse<T> {
  data: T[];
  total: number;
  page: number;
  limit: number;
}

export interface ApiError {
  status: number;
  code: string;
  message: string;
  details?: Record<string, unknown>;
}

export interface HttpClientConfig {
  baseURL: string;
  timeout: number;
  headers?: Record<string, string>;
}

export interface WebSocketConfig {
  url: string;
  reconnectInterval: number;
  maxRetries: number;
}

export interface WebSocketMessage<T = unknown> {
  type: string;
  data: T;
  timestamp: string;
}
