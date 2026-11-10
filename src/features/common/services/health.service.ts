import { httpClient } from '../http';

export interface HealthResponse {
  status: string;
  service: string;
  timestamp: string;
}

/**
 * Servicio para verificar el estado operativo y conectividad del backend
 * GET /api/health
 */
export const healthService = {
  async checkHealth(): Promise<HealthResponse> {
    return httpClient.get<HealthResponse>('/health');
  },
};

