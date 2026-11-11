import { httpClient } from '@/features/common/http';
import { UserStatsResponse } from '@/features/reviews/domain/review.types';

export const usersService = {
  /**
   * Obtiene las estadísticas personales de gameplay del usuario autenticado (GET /api/users/stats)
   */
  async getUserStats(): Promise<UserStatsResponse> {
    return httpClient.get<UserStatsResponse>('/users/stats');
  },
};

