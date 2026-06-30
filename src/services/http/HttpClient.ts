/**
 * Cliente HTTP centralizado
 * - Reintentos automáticos
 * - Manejo de errores
 * - Interceptores
 * - Type-safe
 */

import type { ApiError } from "@/api/api.interface";
import { apiConfig, HTTP_STATUS_CODES, RETRY_CONFIG } from "@config/api.config";
import axios, { AxiosError, AxiosInstance, AxiosRequestConfig } from "axios";

export class HttpClient {
  private client: AxiosInstance;
  private retryCount: Map<string, number> = new Map();

  constructor() {
    this.client = axios.create(apiConfig);
    this.setupInterceptors();
  }

  private setupInterceptors(): void {
    // Response interceptor para manejo de errores
    this.client.interceptors.response.use(
      (response) => response,
      async (error: AxiosError) => {
        const config = error.config;
        if (!config) throw error;

        // Determinar si el request es reintentable
        if (this.isRetryable(error)) {
          const key = `${config.method}:${config.url}`;
          const retries = this.retryCount.get(key) || 0;

          if (retries < RETRY_CONFIG.maxRetries) {
            this.retryCount.set(key, retries + 1);
            const delay = this.calculateBackoffDelay(retries);

            await this.delay(delay);
            return this.client(config);
          }
        }

        throw this.transformError(error);
      },
    );
  }

  private isRetryable(error: AxiosError): boolean {
    const status = error.response?.status;
    return !!status && RETRY_CONFIG.retryableStatuses.includes(status);
  }

  private calculateBackoffDelay(retryCount: number): number {
    return (
      RETRY_CONFIG.initialDelayMs *
      Math.pow(RETRY_CONFIG.backoffMultiplier, retryCount)
    );
  }

  private delay(ms: number): Promise<void> {
    return new Promise((resolve) => setTimeout(resolve, ms));
  }

  private transformError(error: AxiosError): ApiError {
    if (error.response) {
      // Error HTTP
      return {
        status: error.response.status,
        code: (error.response.data as any)?.code || "UNKNOWN_ERROR",
        message: (error.response.data as any)?.message || error.message,
        details: (error.response.data as any)?.details,
      };
    }

    if (error.code === "ECONNABORTED") {
      return {
        status: HTTP_STATUS_CODES.TIMEOUT,
        code: "REQUEST_TIMEOUT",
        message: "La solicitud tardó demasiado",
      };
    }

    // Error de red u otro
    return {
      status: 0,
      code: error.code || "NETWORK_ERROR",
      message: error.message || "Error de conexión",
    };
  }

  // Métodos públicos

  async get<T>(url: string, config?: AxiosRequestConfig): Promise<T> {
    const response = await this.client.get<T>(url, config);
    return response.data;
  }

  async post<T>(
    url: string,
    data?: unknown,
    config?: AxiosRequestConfig,
  ): Promise<T> {
    const response = await this.client.post<T>(url, data, config);
    return response.data;
  }

  async put<T>(
    url: string,
    data?: unknown,
    config?: AxiosRequestConfig,
  ): Promise<T> {
    const response = await this.client.put<T>(url, data, config);
    return response.data;
  }

  async patch<T>(
    url: string,
    data?: unknown,
    config?: AxiosRequestConfig,
  ): Promise<T> {
    const response = await this.client.patch<T>(url, data, config);
    return response.data;
  }

  async delete<T>(url: string, config?: AxiosRequestConfig): Promise<T> {
    const response = await this.client.delete<T>(url, config);
    return response.data;
  }

  /**
   * Resetea los contadores de reintento
   */
  resetRetries(): void {
    this.retryCount.clear();
  }

  /**
   * Obtiene la instancia de axios para casos especiales
   */
  getAxiosInstance(): AxiosInstance {
    return this.client;
  }
}

// Singleton
export const httpClient = new HttpClient();
