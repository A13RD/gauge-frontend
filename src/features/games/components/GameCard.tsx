'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { Star, Gamepad2, ArrowRight } from 'lucide-react';
import { Game, getGameRating } from '../domain/game.types';

export interface GameCardProps {
  game: Game;
  className?: string;
  priority?: boolean;
}

export function GameCard({ game, className = '' }: GameCardProps) {
  const [imgError, setImgError] = useState(false);
  const rating = getGameRating(game);

  return (
    <Link
      href={`/catalogo/${game.id}`}
      prefetch={false}
      className={`group relative flex flex-col justify-between glass-panel rounded-2xl p-3 border border-frost-steel dark:border-steam-steel/50 shadow-md hover:shadow-xl hover:border-sky-accent dark:hover:border-steam-blue transition-all duration-300 focus:outline-none focus:ring-2 focus:ring-sky-accent dark:focus:ring-steam-blue ${className}`}
    >
      {/* Contenedor de la Portada con proporción estándar 3:4 */}
      <div className="relative aspect-[3/4] w-full rounded-xl overflow-hidden bg-frost-bg dark:bg-steam-dark/80 border border-frost-steel/60 dark:border-steam-steel/50 mb-3 select-none">
        {game.coverUrl && !imgError ? (
          // eslint-disable-next-line @next/next/no-img-element
          <img
            src={game.coverUrl}
            alt={`Portada de ${game.title}`}
            loading="lazy"
            onError={() => setImgError(true)}
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500 ease-out"
          />
        ) : (
          <div className="w-full h-full flex flex-col items-center justify-center p-4 text-center bg-gradient-to-b from-transparent to-frost-steel/20 dark:to-steam-steel/30">
            <Gamepad2 className="w-12 h-12 text-active-slate/30 dark:text-steam-light/30 mb-2 group-hover:scale-110 transition-transform duration-300" aria-hidden="true" />
            <span className="text-[11px] font-mono text-active-slate/70 dark:text-steam-light/60 line-clamp-2">
              {game.title}
            </span>
          </div>
        )}

        {/* Degradado sobre la imagen para legibilidad de insignias */}
        <div
          aria-hidden="true"
          className="absolute inset-0 bg-gradient-to-t from-charcoal-text/80 via-transparent to-black/40 pointer-events-none"
        />

        {/* Insignia de Género superior izquierda */}
        {game.genre && (
          <div className="absolute top-2.5 left-2.5">
            <span className="text-[10px] font-mono font-bold uppercase tracking-wider px-2 py-0.5 rounded-md bg-white/95 dark:bg-steam-dark/95 text-charcoal-text dark:text-pure-white border border-frost-steel/80 dark:border-steam-steel/60 shadow-sm backdrop-blur-xs">
              {game.genre.name}
            </span>
          </div>
        )}

        {/* Insignia de Puntuación superior derecha */}
        <div className="absolute top-2.5 right-2.5">
          <span className="inline-flex items-center gap-1 text-[11px] font-mono font-bold px-2 py-0.5 rounded-md bg-sky-accent text-white dark:bg-steam-blue dark:text-steam-dark shadow-[0_2px_8px_rgba(2,132,199,0.4)]">
            <Star className="w-3 h-3 fill-current" aria-hidden="true" />
            {rating !== null ? rating.toFixed(1) : 'Nuevo'}
          </span>
        </div>

        {/* Indicador sutil de hover en la parte inferior */}
        <div className="absolute bottom-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
          <span className="p-1.5 rounded-lg bg-sky-accent text-white dark:bg-steam-blue dark:text-steam-dark flex items-center justify-center shadow-md">
            <ArrowRight className="w-3.5 h-3.5" aria-hidden="true" />
          </span>
        </div>
      </div>

      {/* Información del videojuego */}
      <div className="space-y-1.5 px-0.5">
        <h3 className="font-bold text-sm text-charcoal-text dark:text-pure-white truncate group-hover:text-sky-accent dark:group-hover:text-steam-blue transition-colors">
          {game.title}
        </h3>

        <div className="flex items-center justify-between text-[11px] text-active-slate/80 dark:text-steam-light/70 font-mono">
          <span className="truncate max-w-[130px]">
            {game.genre?.name || 'General'}
          </span>
          <span className="text-sky-accent dark:text-steam-blue font-semibold group-hover:underline">
            Ver Ficha →
          </span>
        </div>
      </div>
    </Link>
  );
}

