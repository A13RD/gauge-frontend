'use client';

import React from 'react';
import { Game } from '../domain/game.types';
import { GameCard } from './GameCard';
import { EmptyState } from '@/features/common/components/EmptyState';
import { ErrorAlert } from '@/features/common/components/ErrorAlert';
import { Button } from '@/features/common/components/Button';
import { Gamepad2, RotateCcw } from 'lucide-react';

export interface GameGridProps {
  games: Game[];
  isLoading?: boolean;
  error?: string | null;
  statusCode?: number | null;
  onRetry?: () => void;
  onClearFilters?: () => void;
  isFiltered?: boolean;
  className?: string;
}

export function GameGrid({
  games,
  isLoading = false,
  error = null,
  statusCode,
  onRetry,
  onClearFilters,
  isFiltered = false,
  className = '',
}: GameGridProps) {
  // 1. Estado de Carga (Skeletons con aspecto 3:4)
  if (isLoading) {
    return (
      <div
        role="status"
        aria-label="Cargando catálogo de videojuegos"
        className={`grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-3 xl:grid-cols-4 gap-4 sm:gap-6 ${className}`}
      >
        {Array.from({ length: 8 }).map((_, index) => (
          <div
            key={index}
            className="glass-panel rounded-2xl p-3 border border-frost-steel dark:border-steam-steel/40 animate-pulse flex flex-col justify-between"
          >
            <div className="aspect-[3/4] w-full rounded-xl bg-frost-steel/40 dark:bg-steam-steel/30 mb-3" />
            <div className="space-y-2">
              <div className="h-4 w-3/4 rounded bg-frost-steel/50 dark:bg-steam-steel/40" />
              <div className="flex justify-between">
                <div className="h-3 w-1/3 rounded bg-frost-steel/40 dark:bg-steam-steel/30" />
                <div className="h-3 w-1/4 rounded bg-frost-steel/40 dark:bg-steam-steel/30" />
              </div>
            </div>
          </div>
        ))}
        <span className="sr-only">Cargando videojuegos...</span>
      </div>
    );
  }

  // 2. Estado de Error
  if (error) {
    return (
      <div className="py-6">
        <ErrorAlert
          title="Error al cargar el catálogo"
          message={error}
          statusCode={statusCode || undefined}
          onRetry={onRetry}
        />
      </div>
    );
  }

  // 3. Estado Vacío
  if (!games || games.length === 0) {
    return (
      <div className="py-10">
        <EmptyState
          icon={<Gamepad2 className="w-8 h-8 opacity-80" />}
          title={isFiltered ? 'Sin resultados para esta búsqueda' : 'Catálogo sin videojuegos'}
          description={
            isFiltered
              ? 'No encontramos ningún videojuego que coincida con los filtros y término de búsqueda seleccionados.'
              : 'Actualmente no hay videojuegos registrados en el catálogo. Intenta recargar o verificar la conexión con el servidor.'
          }
          action={
            isFiltered && onClearFilters ? (
              <Button
                variant="outline"
                size="sm"
                onClick={onClearFilters}
                leftIcon={<RotateCcw className="w-3.5 h-3.5" />}
              >
                Limpiar filtros
              </Button>
            ) : onRetry ? (
              <Button variant="secondary" size="sm" onClick={onRetry}>
                Reintentar carga
              </Button>
            ) : undefined
          }
        />
      </div>
    );
  }

  // 4. Grilla de Videojuegos
  return (
    <div
      className={`grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-3 xl:grid-cols-4 gap-4 sm:gap-6 ${className}`}
    >
      {games.map((game) => (
        <GameCard key={game.id} game={game} />
      ))}
    </div>
  );
}

