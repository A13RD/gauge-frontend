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
      const response: PaginatedGamesResponse = await gamesService.getGames(currentFilter);
      setGames(response.data || []);
      setPagination(
        response.pagination || {
          total: response.data ? response.data.length : 0,
          currentPage: currentFilter.page || 1,
          limit: currentFilter.limit || 10,
          totalPages: Math.ceil((response.data ? response.data.length : 0) / (currentFilter.limit || 10)) || 1,
        }
      );
    } catch (err: unknown) {
      if (err instanceof HttpClientError) {
        setStatusCode(err.statusCode);
        setError(err.message || 'Error al comunicarse con el servidor');
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

