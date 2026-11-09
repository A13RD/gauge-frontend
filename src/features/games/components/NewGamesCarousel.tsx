'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { Gamepad2, ChevronRight, Star } from 'lucide-react';
import { Game, getGameRating } from '../domain/game.types';

export interface NewGamesCarouselProps {
  games?: Game[];
  isLoading?: boolean;
  className?: string;
}

function CarouselItem({ game, rank }: { game: Game; rank: number }) {
  const [imgError, setImgError] = useState(false);
  const rating = getGameRating(game);

  return (
    <Link
      href={`/catalogo/${game.id}`}
      prefetch={false}
      className="min-w-[200px] sm:min-w-[220px] max-w-[240px] shrink-0 snap-start glass-panel rounded-2xl p-3 border border-frost-steel dark:border-steam-steel/50 shadow-md group hover:border-sky-accent dark:hover:border-steam-blue transition-all duration-300 flex flex-col justify-between"
    >
      {/* Portada con marco de relación 3:4 */}
      <div className="relative aspect-[3/4] w-full rounded-xl overflow-hidden bg-frost-bg dark:bg-steam-steel/30 border border-frost-steel/60 dark:border-steam-steel/50 flex flex-col justify-between p-3 mb-3 select-none">
        {game.coverUrl && !imgError ? (
          // eslint-disable-next-line @next/next/no-img-element
          <img
            src={game.coverUrl}
            alt={game.title}
            loading="lazy"
            onError={() => setImgError(true)}
            className="absolute inset-0 w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
          />
        ) : (
          <div className="absolute inset-0 w-full h-full flex items-center justify-center bg-gradient-to-b from-transparent to-frost-steel/20 dark:to-steam-steel/30">
            <Gamepad2 className="w-10 h-10 text-active-slate/40 dark:text-steam-light/30 group-hover:scale-110 transition-transform" aria-hidden="true" />
          </div>
        )}

        {/* Gradiente superior para contraste de insignias */}
        <div
          aria-hidden="true"
          className="absolute inset-0 bg-gradient-to-t from-charcoal-text/80 via-transparent to-black/40 pointer-events-none"
        />

        <div className="relative z-10 flex justify-between items-start">
          <span className="text-[10px] font-mono px-2 py-0.5 rounded-md bg-white/95 dark:bg-steam-dark/95 text-charcoal-text dark:text-pure-white font-bold shadow-sm">
            #{rank}
          </span>
          <span className="inline-flex items-center gap-1 text-[11px] font-mono font-bold px-2 py-0.5 rounded-md bg-sky-accent text-white dark:bg-steam-blue dark:text-steam-dark shadow-sm">
            <Star className="w-3 h-3 fill-current" aria-hidden="true" />
            {rating !== null ? rating.toFixed(1) : 'Nuevo'}
          </span>
        </div>

        <div className="relative z-10 text-right mt-auto">
          {game.genre && (
            <span className="text-[10px] font-mono uppercase font-semibold text-white/90 bg-black/50 px-1.5 py-0.5 rounded">
              {game.genre.name}
            </span>
          )}
        </div>
      </div>

      {/* Título y metadatos */}
      <div className="space-y-1">
        <h3 className="font-bold text-sm text-charcoal-text dark:text-pure-white truncate group-hover:text-sky-accent dark:group-hover:text-steam-blue transition-colors">
          {game.title}
        </h3>
        <div className="flex items-center justify-between text-[11px] text-active-slate/80 dark:text-steam-light/70">
          <span className="truncate">{game.genre?.name || 'Videojuego'}</span>
          <span className="font-mono text-sky-accent dark:text-steam-blue font-semibold">
            Ficha →
          </span>
        </div>
      </div>
    </Link>
  );
}

export function NewGamesCarousel({
  games = [],
  isLoading = false,
  className = '',
}: NewGamesCarouselProps) {
  return (
    <section aria-label="Carrusel de nuevos lanzamientos" className={`space-y-4 ${className}`}>
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2.5">
          <div className="p-2 rounded-xl bg-white dark:bg-steam-navy border border-frost-steel dark:border-steam-steel/60 text-sky-accent dark:text-steam-blue shadow-sm">
            <Gamepad2 className="w-5 h-5" aria-hidden="true" />
          </div>
          <div>
            <h2 className="text-base sm:text-lg font-bold text-charcoal-text dark:text-pure-white font-mono uppercase">
              Nuevos Juegos
            </h2>
            <p className="text-xs text-active-slate/70 dark:text-steam-light/70">
              Lanzamientos y títulos incorporados recientemente
            </p>
          </div>
        </div>

        <Link
          href="/catalogo"
          className="inline-flex items-center gap-1 text-xs font-mono font-bold text-sky-accent dark:text-steam-blue hover:underline"
        >
          <span>Ver catálogo</span>
          <ChevronRight className="w-4 h-4" aria-hidden="true" />
        </Link>
      </div>

      {/* Contenedor del carrusel con snap scrolling fluido */}
      <div className="flex gap-4 overflow-x-auto pb-3 snap-x snap-mandatory scrollbar-none -mx-1 px-1">
        {isLoading ? (
          Array.from({ length: 5 }).map((_, idx) => (
            <div
              key={idx}
              className="min-w-[200px] sm:min-w-[220px] max-w-[240px] shrink-0 snap-start glass-panel rounded-2xl p-3 border border-frost-steel dark:border-steam-steel/40 animate-pulse space-y-3"
            >
              <div className="aspect-[3/4] w-full rounded-xl bg-frost-steel/40 dark:bg-steam-steel/30" />
              <div className="h-4 w-3/4 rounded bg-frost-steel/40 dark:bg-steam-steel/30" />
              <div className="h-3 w-1/2 rounded bg-frost-steel/30 dark:bg-steam-steel/20" />
            </div>
          ))
        ) : games.length > 0 ? (
          games.map((game, idx) => (
            <CarouselItem key={game.id || idx} game={game} rank={idx + 1} />
          ))
        ) : (
          <div className="w-full glass-panel rounded-2xl p-6 text-center text-xs text-active-slate/70 dark:text-steam-light/70 border border-frost-steel dark:border-steam-steel/40">
            No hay lanzamientos recientes disponibles en el catálogo en este momento.
          </div>
        )}
      </div>
    </section>
  );
}

