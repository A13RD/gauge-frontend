'use client';

import { useState, useEffect, useCallback } from 'react';
import { Game } from '../domain/game.types';
import { gamesService } from '../services/games.service';
import { HttpClientError } from '@/features/common/http';

export interface UseGameDetailResult {
  game: Game | null;
  isLoading: boolean;
  error: string | null;
  statusCode: number | null;
  refetch: () => Promise<void>;
}

export function useGameDetail(id: string): UseGameDetailResult {
  const [game, setGame] = useState<Game | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [statusCode, setStatusCode] = useState<number | null>(null);

  const fetchDetail = useCallback(async () => {
    if (!id || id.trim() === '') {
      setError('ID de videojuego no proporcionado');
      setIsLoading(false);
      return;
    }

    setIsLoading(true);
    setError(null);
    setStatusCode(null);

    try {
      const data = await gamesService.getGameById(id);
      setGame(data);
    } catch (err: unknown) {
      if (err instanceof HttpClientError) {
        setStatusCode(err.statusCode);
        if (err.statusCode === 404) {
          setError('El videojuego solicitado no existe o fue retirado del catálogo');
        } else {
          setError(err.message || 'Error al cargar la información del videojuego');
        }
      } else if (err instanceof Error) {
        setError(err.message);
      } else {
        setError('Error inesperado al cargar la ficha técnica');
      }
      setGame(null);
    } finally {
      setIsLoading(false);
    }
  }, [id]);

  useEffect(() => {
    let isCancelled = false;

    fetchDetail().then(() => {
      if (isCancelled) return;
    });

    return () => {
      isCancelled = true;
    };
  }, [fetchDetail]);

  return {
    game,
    isLoading,
    error,
    statusCode,
    refetch: fetchDetail,
  };
}

