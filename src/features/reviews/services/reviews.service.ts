import { httpClient } from '@/features/common/http';
import { CreateReviewDTO, Review, UpdateReviewDTO } from '../domain/review.types';

export const reviewsService = {
  /**
   * Publica una nueva reseña para un videojuego (POST /api/reviews)
   */
  async createReview(dto: CreateReviewDTO): Promise<Review> {
    return httpClient.post<Review>('/reviews', dto);
  },

  /**
   * Obtiene el listado de reseñas creadas por el usuario autenticado (GET /api/reviews/mias)
   */
  async getMyReviews(): Promise<Review[]> {
    return httpClient.get<Review[]>('/reviews/mias');
  },

  /**
   * Obtiene una reseña específica por su ID (GET /api/reviews/:id)
   */
  async getReviewById(id: string): Promise<Review> {
    return httpClient.get<Review>(`/reviews/${encodeURIComponent(id)}`);
  },

  /**
   * Actualiza una reseña propia (PUT /api/reviews/:id)
   */
  async updateReview(id: string, dto: UpdateReviewDTO): Promise<Review> {
    return httpClient.put<Review>(`/reviews/${encodeURIComponent(id)}`, dto);
  },

  /**
   * Elimina lógicamente una reseña propia (DELETE /api/reviews/:id)
   */
  async deleteReview(id: string): Promise<{ message: string }> {
    return httpClient.delete<{ message: string }>(`/reviews/${encodeURIComponent(id)}`);
  },
};

