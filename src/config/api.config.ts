import type { HttpClientConfig } from "@/api/api.interface";

const API_BASE_URL =
  import.meta.env.VITE_API_BASE_URL || "http://localhost:3001";
const API_TIMEOUT = parseInt(import.meta.env.VITE_API_TIMEOUT || "10000", 10);

export const apiConfig: HttpClientConfig = {
  baseURL: API_BASE_URL,
  timeout: API_TIMEOUT,
  headers: {
    "Content-Type": "application/json",
    Accept: "application/json",
  },
};

export const HTTP_STATUS_CODES = {
  OK: 200,
  CREATED: 201,
  BAD_REQUEST: 400,
  UNAUTHORIZED: 401,
  FORBIDDEN: 403,
  NOT_FOUND: 404,
  TIMEOUT: 408,
  TOO_MANY_REQUESTS: 429,
  INTERNAL_SERVER_ERROR: 500,
  BAD_GATEWAY: 502,
  SERVICE_UNAVAILABLE: 503,
} as const;

/**
 * Configuración de reintentos para requests fallidas
 */
export const RETRY_CONFIG = {
  maxRetries: 3,
  retryableStatuses: [408, 429, 500, 502, 503],
  backoffMultiplier: 2,
  initialDelayMs: 100,
} as const;

/**
 * Timeouts específicos por tipo de request (en ms)
 */
export const TIMEOUTS = {
  short: 5000, // Queries rápidas
  normal: 10000, // Default
  long: 30000, // Queries lentas (reportes, etc.)
} as const;
