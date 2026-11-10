'use client';

import { useState, useEffect, useCallback, useRef } from 'react';
import {
  Game,
  GameFilter,
  PaginationMeta,
  PaginatedGamesResponse,
} from '../domain/game.types';
import { gamesService } from '../services/games.service';
import { HttpClientError } from '@/features/common/http';

export interface UseGamesResult {
  games: Game[];
  pagination: PaginationMeta | null;
  isLoading: boolean;
  error: string | null;
  statusCode: number | null;
  filter: GameFilter;
  setFilter: (newFilter: Partial<GameFilter> | ((prev: GameFilter) => GameFilter)) => void;
  refetch: () => Promise<void>;
}

export function useGames(initialFilter: GameFilter = {}): UseGamesResult {
  const [filter, setFilterState] = useState<GameFilter>(() => ({
    page: 1,
    limit: 10,
    ...initialFilter,
  }));

  const [games, setGames] = useState<Game[]>([]);
  const [pagination, setPagination] = useState<PaginationMeta | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [statusCode, setStatusCode] = useState<number | null>(null);

  // Mantener referencia al filtro actual para peticiones manuales
  const filterRef = useRef(filter);
  filterRef.current = filter;

  const fetchGames = useCallback(async (currentFilter: GameFilter) => {
    setIsLoading(true);
    setError(null);
    setStatusCode(null);

    try {
      const response = await gamesService.getGames(currentFilter);

      // Soporte defensivo para respuesta plana [...] o estructurada { data: [...], pagination: {...} }
      if (Array.isArray(response)) {
        const gameList = response as Game[];
        setGames(gameList);
        setPagination({
          total: gameList.length,
          currentPage: currentFilter.page || 1,
          limit: currentFilter.limit || 10,
          totalPages: Math.ceil(gameList.length / (currentFilter.limit || 10)) || 1,
        });
      } else if (response && Array.isArray((response as PaginatedGamesResponse).data)) {
        const paginated = response as PaginatedGamesResponse;
        setGames(paginated.data);
        setPagination(
          paginated.pagination || {
            total: paginated.data.length,
            currentPage: currentFilter.page || 1,
            limit: currentFilter.limit || 10,
            totalPages:
              Math.ceil(paginated.data.length / (currentFilter.limit || 10)) || 1,
          }
        );
      } else {
        setGames([]);
        setPagination(null);
      }
    } catch (err: unknown) {
      if (err instanceof HttpClientError) {
        setStatusCode(err.statusCode);
        if (err.statusCode === 404) {
          setError(
            err.message === 'Ruta no encontrada'
              ? 'El endpoint de videojuegos (/api/games) aún no ha sido expuesto en el backend (HTTP 404).'
              : err.message
          );
        } else {
          setError(err.message || 'Error al comunicarse con el servidor');
        }
      } else if (err instanceof Error) {
        setError(err.message);
      } else {
        setError('Error desconocido al obtener la lista de videojuegos');
      }
      setGames([]);
      setPagination(null);
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    let isCancelled = false;

    fetchGames(filter).then(() => {
      if (isCancelled) return;
    });

    return () => {
      isCancelled = true;
    };
  }, [filter, fetchGames]);

  const setFilter = useCallback(
    (newFilter: Partial<GameFilter> | ((prev: GameFilter) => GameFilter)) => {
      setFilterState((prev) => {
        if (typeof newFilter === 'function') {
          return newFilter(prev);
        }
        return {
          ...prev,
          ...newFilter,
        };
      });
    },
    []
  );

  const refetch = useCallback(async () => {
    await fetchGames(filterRef.current);
  }, [fetchGames]);

  return {
    games,
    pagination,
    isLoading,
    error,
    statusCode,
    filter,
    setFilter,
    refetch,
  };
}

