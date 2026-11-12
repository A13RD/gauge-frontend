'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import {
  Sparkles,
  ChevronLeft,
  ChevronRight,
  Star,
  Compass,
  RefreshCw,
  Gamepad2,
} from 'lucide-react';
import { Game, getGameRating } from '../domain/game.types';
import { Button } from '@/features/common/components/Button';

export interface HeroValorantCardProps {
  games?: Game[];
  isLoading?: boolean;
  error?: string | null;
  onRetry?: () => void;
  className?: string;
}

export function HeroValorantCard({
  games = [],
  isLoading = false,
  error = null,
  onRetry,
  className = '',
}: HeroValorantCardProps) {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [imgError, setImgError] = useState(false);

  // 1. Estado de Carga (Skeleton Neo-Arcade con dimensiones fijas idénticas al Hero)
  if (isLoading) {
    return (
      <section
        aria-label="Cargando videojuego destacado"
        className={`relative glass-panel rounded-3xl p-6 sm:p-8 md:p-10 overflow-hidden border border-frost-steel dark:border-steam-steel/40 shadow-2xl animate-pulse w-full h-[380px] sm:h-[400px] md:h-[420px] flex flex-col justify-between ${className}`}
      >
        <div className="flex flex-col gap-4 max-w-xl">
          <div className="flex items-center gap-2">
            <div className="h-6 w-32 rounded-full bg-frost-steel/50 dark:bg-steam-steel/40" />
            <div className="h-6 w-24 rounded-full bg-frost-steel/40 dark:bg-steam-steel/30" />
          </div>
          <div className="h-10 sm:h-12 w-3/4 rounded-xl bg-frost-steel/60 dark:bg-steam-steel/50" />
          <div className="space-y-2">
            <div className="h-4 w-full rounded-md bg-frost-steel/40 dark:bg-steam-steel/30" />
            <div className="h-4 w-5/6 rounded-md bg-frost-steel/40 dark:bg-steam-steel/30" />
          </div>
        </div>
        <div className="flex items-center justify-between pt-6 border-t border-frost-steel/40 dark:border-steam-steel/30">
          <div className="h-10 w-44 rounded-xl bg-frost-steel/50 dark:bg-steam-steel/40" />
          <div className="flex items-center gap-1.5">
            <div className="h-2 w-6 rounded-full bg-frost-steel/60 dark:bg-steam-steel/50" />
            <div className="h-2 w-2 rounded-full bg-frost-steel/40 dark:bg-steam-steel/30" />
            <div className="h-2 w-2 rounded-full bg-frost-steel/40 dark:bg-steam-steel/30" />
          </div>
        </div>
      </section>
    );
  }

  // 2. Estado de Error
  if (error) {
    return (
      <section
        aria-label="Aviso de carga del videojuego destacado"
        className={`glass-panel rounded-3xl p-6 sm:p-8 border border-rose-500/30 dark:border-rose-500/40 shadow-xl ${className}`}
      >
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <div className="space-y-1">
            <span className="text-xs font-mono font-bold uppercase text-rose-500 dark:text-rose-400">
              Servicio de catálogo no disponible
            </span>
            <h3 className="text-lg font-bold text-charcoal-text dark:text-pure-white">
              No se pudo conectar con el catálogo de juegos
            </h3>
            <p className="text-xs sm:text-sm text-active-slate dark:text-steam-light">
              {error}
            </p>
          </div>
          {onRetry && (
            <Button
              variant="outline"
              size="sm"
              onClick={onRetry}
              leftIcon={<RefreshCw className="w-3.5 h-3.5" />}
            >
              Reintentar
            </Button>
          )}
        </div>
      </section>
    );
  }

  // 3. Estado Vacío (Sin juegos en la base de datos)
  if (!games || games.length === 0) {
    return (
      <section
        aria-label="Sin videojuegos en el catálogo"
        className={`glass-panel rounded-3xl p-8 sm:p-10 border border-frost-steel dark:border-steam-steel/40 shadow-xl text-center flex flex-col items-center justify-center gap-4 ${className}`}
      >
        <div className="w-14 h-14 rounded-2xl bg-frost-bg dark:bg-steam-steel/30 border border-frost-steel dark:border-steam-steel/50 flex items-center justify-center text-sky-accent dark:text-steam-blue">
          <Gamepad2 className="w-7 h-7" aria-hidden="true" />
        </div>
        <div className="max-w-md space-y-1">
          <h3 className="text-lg font-bold text-charcoal-text dark:text-pure-white font-mono">
            Catálogo en Preparación
          </h3>
          <p className="text-xs sm:text-sm text-active-slate dark:text-steam-light">
            Aún no se han registrado videojuegos en la base de datos.
          </p>
        </div>
        <Link href="/catalogo">
          <Button variant="secondary" size="sm" leftIcon={<Compass className="w-4 h-4" />}>
            Explorar Catálogo
          </Button>
        </Link>
      </section>
    );
  }

  // 4. Renderizado con datos reales
  const safeIndex = Math.min(Math.max(0, currentIndex), games.length - 1);
  const currentGame = games[safeIndex];
  const rating = getGameRating(currentGame);
  const totalGames = games.length;

  const handlePrev = () => {
    setImgError(false);
    setCurrentIndex((prev) => (prev > 0 ? prev - 1 : totalGames - 1));
  };

  const handleNext = () => {
    setImgError(false);
    setCurrentIndex((prev) => (prev < totalGames - 1 ? prev + 1 : 0));
  };

  const bannerSource = currentGame.bannerUrl || currentGame.coverUrl;

  return (
    <section
      aria-label={`Videojuego destacado: ${currentGame.title}`}
      className={`relative glass-panel rounded-3xl p-6 sm:p-8 md:p-10 overflow-hidden border border-frost-steel dark:border-steam-steel/40 shadow-2xl transition-all group w-full h-[380px] sm:h-[400px] md:h-[420px] flex flex-col justify-between ${className}`}
    >
      {/* Fondo inmersivo con imagen del juego */}
      {bannerSource && !imgError && (
        <div className="absolute inset-0 z-0 overflow-hidden select-none">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src={bannerSource}
            alt=""
            role="presentation"
            onError={() => setImgError(true)}
            className="w-full h-full object-cover object-center filter blur-xs sm:blur-none scale-105 group-hover:scale-110 transition-transform duration-700 opacity-25 dark:opacity-20"
          />
        </div>
      )}

      {/* Degradado atmosférico Neo-Arcade */}
      <div
        aria-hidden="true"
        className="absolute inset-0 z-0 bg-gradient-to-r from-frost-bg/95 via-frost-bg/85 to-transparent dark:from-steam-navy/95 dark:via-steam-navy/85 dark:to-steam-dark/60 pointer-events-none"
      />

      <div className="relative z-10 flex flex-col justify-between h-full gap-4">
        {/* Encabezado fijo: Insignias de recomendación, género y puntuación */}
        <div className="shrink-0 flex flex-wrap items-center justify-between gap-2 min-h-[2rem]">
          <div className="flex flex-wrap items-center gap-2">
            <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-mono font-bold uppercase tracking-wider bg-sky-accent/15 dark:bg-steam-blue/20 text-sky-accent dark:text-steam-blue border border-sky-accent/30 dark:border-steam-blue/40 shadow-xs">
              <Sparkles className="w-3.5 h-3.5 shrink-0" aria-hidden="true" />
              <span className="truncate">DESTACADO DE LA COMUNIDAD</span>
            </span>

            {currentGame.genre && (
              <span className="inline-flex items-center px-2.5 py-1 rounded-full text-xs font-mono font-medium bg-white/80 dark:bg-steam-steel/40 text-charcoal-text dark:text-pure-white border border-frost-steel dark:border-steam-steel/50">
                {currentGame.genre.name}
              </span>
            )}
          </div>

          {/* Insignia de Calificación */}
          <div className="flex items-center gap-2 shrink-0">
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-white dark:bg-steam-dark border border-frost-steel dark:border-steam-steel/50 shadow-sm">
              <Star className="w-3.5 h-3.5 text-amber-500 fill-amber-500 shrink-0" aria-hidden="true" />
              <span className="text-xs font-mono font-bold text-charcoal-text dark:text-pure-white">
                {rating !== null ? `${rating.toFixed(1)} / 10` : 'Sin reseñas'}
              </span>
              <span className="text-[10px] text-active-slate/70 dark:text-steam-light/60 font-mono hidden sm:inline">
                Puntuación Media
              </span>
            </div>
          </div>
        </div>

        {/* Contenido principal con altura fija para título y sinopsis (sin saltos entre slides) */}
        <div className="max-w-xl my-auto flex flex-col justify-center gap-2.5 overflow-hidden">
          <div className="h-[3.5rem] sm:h-[4.25rem] md:h-[5rem] flex items-end overflow-hidden">
            <h1
              title={currentGame.title}
              className="text-2xl sm:text-3xl md:text-4xl lg:text-[2.6rem] font-black tracking-tight text-charcoal-text dark:text-pure-white font-sans uppercase leading-tight line-clamp-2 text-ellipsis overflow-hidden"
            >
              {currentGame.title}
            </h1>
          </div>
          <div className="h-[3.75rem] sm:h-[4.5rem] overflow-hidden">
            <p className="text-xs sm:text-sm md:text-base text-active-slate dark:text-steam-light leading-relaxed line-clamp-3 text-ellipsis overflow-hidden">
              {currentGame.description ||
                'Explora el análisis técnico, tiempos promedio y evaluaciones fundamentadas de la comunidad sobre este título.'}
            </p>
          </div>
        </div>

        {/* Acciones principales y controles del carrusel alineados al fondo */}
        <div className="shrink-0 mt-auto flex flex-wrap items-center justify-between gap-3 pt-3 border-t border-frost-steel/60 dark:border-steam-steel/30">
          <div className="flex items-center gap-3">
            <Link href={`/catalogo/${currentGame.id}`}>
              <Button
                variant="primary"
                size="md"
                leftIcon={<Compass className="w-4 h-4" />}
              >
                Consultar Ficha Técnica
              </Button>
            </Link>
          </div>

          {/* Controles de navegación del carrusel (cuando hay más de 1 juego) */}
          {totalGames > 1 && (
            <div className="flex items-center gap-3">
              {/* Indicadores de posición */}
              <div
                className="flex items-center gap-1.5"
                role="tablist"
                aria-label="Posición de carrusel destacado"
              >
                {games.slice(0, 6).map((g, idx) => (
                  <button
                    key={g.id || idx}
                    type="button"
                    onClick={() => {
                      setImgError(false);
                      setCurrentIndex(idx);
                    }}
                    aria-label={`Ir al juego ${idx + 1}`}
                    aria-selected={idx === safeIndex}
                    className={`transition-all duration-300 rounded-full ${
                      idx === safeIndex
                        ? 'w-6 h-1.5 bg-sky-accent dark:bg-steam-blue shadow-[0_0_8px_rgba(2,132,199,0.8)]'
                        : 'w-1.5 h-1.5 bg-frost-steel dark:bg-steam-steel/60 hover:bg-sky-accent/60'
                    }`}
                  />
                ))}
              </div>

              {/* Botones de flecha */}
              <div className="flex items-center gap-1">
                <button
                  type="button"
                  onClick={handlePrev}
                  aria-label="Juego anterior"
                  className="p-1.5 rounded-lg text-active-slate dark:text-steam-light hover:bg-white dark:hover:bg-steam-steel/40 border border-frost-steel dark:border-steam-steel/50 transition-colors"
                >
                  <ChevronLeft className="w-4 h-4" aria-hidden="true" />
                </button>
                <button
                  type="button"
                  onClick={handleNext}
                  aria-label="Siguiente juego"
                  className="p-1.5 rounded-lg text-active-slate dark:text-steam-light hover:bg-white dark:hover:bg-steam-steel/40 border border-frost-steel dark:border-steam-steel/50 transition-colors"
                >
                  <ChevronRight className="w-4 h-4" aria-hidden="true" />
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </section>
  );
}

