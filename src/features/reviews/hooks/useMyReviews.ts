import { useState, useEffect, useCallback } from 'react';
import { Review } from '../domain/review.types';
import { reviewsService } from '../services/reviews.service';
import { HttpClientError } from '@/features/common/http';

export function useMyReviews() {
  const [reviews, setReviews] = useState<Review[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [statusCode, setStatusCode] = useState<number | null>(null);
  const [isDeleting, setIsDeleting] = useState<boolean>(false);

  const fetchReviews = useCallback(async () => {
    setIsLoading(true);
    setError(null);
    setStatusCode(null);

    try {
      const data = await reviewsService.getMyReviews();
      setReviews(Array.isArray(data) ? data : []);
    } catch (err: unknown) {
      if (err instanceof HttpClientError) {
        setStatusCode(err.statusCode);
        setError(err.message);
      } else if (err instanceof Error) {
        setError(err.message);
      } else {
        setError('Error desconocido al cargar tus reseñas');
      }
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchReviews();
  }, [fetchReviews]);

  const deleteReview = async (id: string): Promise<boolean> => {
    setIsDeleting(true);
    try {
      await reviewsService.deleteReview(id);
      setReviews((prev) => prev.filter((r) => r.id !== id));
      return true;
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : 'Error al eliminar la reseña';
      setError(msg);
      return false;
    } finally {
      setIsDeleting(false);
    }
  };

  return {
    reviews,
    isLoading,
    error,
    statusCode,
    isDeleting,
    refetch: fetchReviews,
    deleteReview,
  };
}

