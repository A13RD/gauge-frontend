'use client';

import { useState, useEffect, useCallback } from 'react';
import { Genre } from '../domain/game.types';
import { gamesService } from '../services/games.service';
import { HttpClientError } from '@/features/common/http';

export interface UseGenresResult {
  genres: Genre[];
  isLoading: boolean;
  error: string | null;
  refetch: () => Promise<void>;
}

export function useGenres(): UseGenresResult {
  const [genres, setGenres] = useState<Genre[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  const fetchGenres = useCallback(async () => {
    setIsLoading(true);
    setError(null);

    try {
      const data = await gamesService.getGenres();
      if (Array.isArray(data)) {
        setGenres(data);
      } else if (data && typeof data === 'object' && Array.isArray((data as { data?: Genre[] }).data)) {
        setGenres((data as { data: Genre[] }).data);
      } else {
        setGenres([]);
      }
    } catch (err: unknown) {
      if (err instanceof HttpClientError) {
        if (err.statusCode === 404) {
          setError(
            err.message === 'Ruta no encontrada'
              ? 'El endpoint de géneros (/api/genres) aún no está disponible en el backend (HTTP 404).'
              : err.message
          );
        } else {
          setError(err.message || 'No se pudieron cargar los géneros');
        }
      } else if (err instanceof Error) {
        setError(err.message);
      } else {
        setError('Error desconocido al obtener géneros');
      }
      setGenres([]);
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    let isCancelled = false;

    fetchGenres().then(() => {
      if (isCancelled) return;
    });

    return () => {
      isCancelled = true;
    };
  }, [fetchGenres]);

  return {
    genres,
    isLoading,
    error,
    refetch: fetchGenres,
  };
}

