export interface Genre {
  id: string;
  name: string;
  slug: string;
}

export interface ReviewAuthor {
  id: string;
  name: string;
}

export interface ReviewItem {
  id: string;
  rating: number;
  content: string;
  hoursPlayed: number;
  createdAt?: string;
  user: ReviewAuthor;
}

export interface Game {
  id: string;
  title: string;
  description: string;
  coverUrl: string;
  bannerUrl?: string | null;
  trailerUrl?: string | null;
  releaseDate?: string;
  genreId?: string;
  genre?: Genre;
  reviews?: ReviewItem[];
  averageRating?: number;
}

export interface PaginationMeta {
  total: number;
  currentPage: number;
  limit: number;
  totalPages: number;
}

export interface PaginatedGamesResponse {
  data: Game[];
  pagination: PaginationMeta;
}

export interface GameFilter {
  page?: number;
  limit?: number;
  genre?: string;
  search?: string;
  sort?: 'recent' | 'popular';
}

/**
 * Calcula la calificación media de un videojuego basada en sus reseñas o su puntuación declarada
 */
export function getGameRating(game: Game): number | null {
  if (typeof game.averageRating === 'number' && !isNaN(game.averageRating)) {
    return Math.round(game.averageRating * 10) / 10;
  }
  if (game.reviews && game.reviews.length > 0) {
    const total = game.reviews.reduce((acc, rev) => acc + (rev.rating || 0), 0);
    const avg = total / game.reviews.length;
    return Math.round(avg * 10) / 10;
  }
  return null;
}

/**
 * Formatea fechas en formato estándar legible
 */
export function formatReleaseDate(dateString?: string): string {
  if (!dateString) return 'Fecha no especificada';
  try {
    const date = new Date(dateString);
    if (isNaN(date.getTime())) return dateString;
    return date.toLocaleDateString('es-ES', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    });
  } catch {
    return dateString;
  }
}
