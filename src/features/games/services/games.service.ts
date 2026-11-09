import { httpClient } from '@/features/common/http';
import {
  Game,
  Genre,
  PaginatedGamesResponse,
  GameFilter,
} from '../domain/game.types';

/**
 * Servicio encargado de la comunicación con los endpoints de videojuegos y géneros
 */
export const gamesService = {
  /**
   * Obtiene el listado paginado de videojuegos con soporte de filtros
   * GET /api/games?page=1&limit=10&genre=...&search=...&sort=...
   */
  async getGames(filter: GameFilter = {}): Promise<PaginatedGamesResponse> {
    const params = new URLSearchParams();

    if (filter.page !== undefined && filter.page > 0) {
      params.set('page', String(filter.page));
    }
    if (filter.limit !== undefined && filter.limit > 0) {
      params.set('limit', String(filter.limit));
    }
    if (filter.genre && filter.genre.trim() !== '') {
      params.set('genre', filter.genre.trim());
    }
    if (filter.search && filter.search.trim() !== '') {
      params.set('search', filter.search.trim());
    }
    if (filter.sort) {
      params.set('sort', filter.sort);
    }

    const queryString = params.toString();
    const endpoint = queryString ? `/games?${queryString}` : '/games';

    return httpClient.get<PaginatedGamesResponse>(endpoint);
  },

  /**
   * Obtiene la ficha técnica completa de un videojuego por su ID
   * GET /api/games/:id
   */
  async getGameById(id: string): Promise<Game> {
    if (!id || id.trim() === '') {
      throw new Error('El identificador del videojuego es requerido');
    }
    return httpClient.get<Game>(`/games/${encodeURIComponent(id.trim())}`);
  },

  /**
   * Obtiene la lista de géneros disponibles en la plataforma
   * GET /api/genres
   */
  async getGenres(): Promise<Genre[]> {
    return httpClient.get<Genre[]>('/genres');
  },
};

