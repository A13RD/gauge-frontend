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
  async getGames(filter: GameFilter = {}): Promise<PaginatedGamesResponse | Game[]> {
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

    return httpClient.get<PaginatedGamesResponse | Game[]>(endpoint);
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

  /**
   * Crea un nuevo videojuego con carga de imagen (POST /api/games)
   * Requiere rol ADMIN y body como FormData con campo 'image'
   */
  async createGame(formData: FormData): Promise<Game> {
    return httpClient.post<Game>('/games', formData);
  },

  /**
   * Actualiza los datos o carátula de un videojuego existente (PUT /api/games/:id)
   * Requiere rol ADMIN
   */
  async updateGame(id: string, formData: FormData | Record<string, unknown>): Promise<Game> {
    return httpClient.put<Game>(`/games/${encodeURIComponent(id)}`, formData);
  },

  /**
   * Elimina lógicamente un videojuego (DELETE /api/games/:id)
   * Requiere rol ADMIN
   */
  async deleteGame(id: string): Promise<{ message: string }> {
    return httpClient.delete<{ message: string }>(`/games/${encodeURIComponent(id)}`);
  },

  /**
   * Crea un nuevo género (POST /api/genres)
   * Requiere rol ADMIN
   */
  async createGenre(data: { name: string; slug?: string }): Promise<Genre> {
    return httpClient.post<Genre>('/genres', data);
  },

  /**
   * Elimina un género no vinculado (DELETE /api/genres/:id)
   * Requiere rol ADMIN
   */
  async deleteGenre(id: string): Promise<{ message: string }> {
    return httpClient.delete<{ message: string }>(`/genres/${encodeURIComponent(id)}`);
  },
};
