'use client';

import React from 'react';
import { Game, getGameRating } from '../domain/game.types';
import { MessageSquareText, Star, ChevronDown, Sparkles } from 'lucide-react';

interface GameReviewScoreCardProps {
  game: Game;
  onScrollToReviews?: () => void;
}

export function GameReviewScoreCard({
  game,
  onScrollToReviews,
}: GameReviewScoreCardProps) {
  const rating = getGameRating(game);
  const reviews = Array.isArray(game.reviews) ? game.reviews : [];
  const count = reviews.length;
  const hasReviews = count > 0 && rating !== null;

  // Cálculo del anillo circular (radio 32, circunferencia 2 * pi * 32 = ~201)
  const radius = 32;
  const circumference = 2 * Math.PI * radius;
  const scorePercent = hasReviews ? Math.min(Math.max(rating / 10, 0), 1) : 0;
  const strokeDashoffset = circumference - scorePercent * circumference;

  const handleClick = () => {
    if (onScrollToReviews) {
      onScrollToReviews();
    } else {
      const el = document.getElementById('resenas-comunidad');
      if (el) {
        el.scrollIntoView({ behavior: 'smooth' });
      }
    }
  };

  return (
    <div
      role="button"
      tabIndex={0}
      onClick={handleClick}
      onKeyDown={(e) => {
        if (e.key === 'Enter' || e.key === ' ') {
          e.preventDefault();
          handleClick();
        }
      }}
      className="glass-panel rounded-2xl p-4 sm:p-5 border border-frost-steel/80 dark:border-steam-steel/60 bg-white/70 dark:bg-steam-navy/80 backdrop-blur-md shadow-xl flex flex-col gap-3 group hover:border-sky-accent dark:hover:border-steam-blue transition-all cursor-pointer select-none"
      aria-label="Ver todas las reseñas de la comunidad para este juego"
    >
      {/* Cabecera del bloque */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <MessageSquareText
            className="w-4 h-4 text-sky-accent dark:text-steam-blue"
            aria-hidden="true"
          />
          <span className="text-[11px] font-mono font-bold uppercase tracking-wider text-charcoal-text dark:text-pure-white">
            Game Reviews
          </span>
        </div>
        <div className="flex items-center gap-1 text-[10px] font-mono text-active-slate/70 dark:text-steam-light/70 group-hover:text-sky-accent dark:group-hover:text-steam-blue transition-colors">
          <span>Ver reseñas</span>
          <ChevronDown className="w-3 h-3 group-hover:translate-y-0.5 transition-transform" />
        </div>
      </div>

      {/* Contenido principal con anillo de puntuación circular */}
      <div className="flex items-center gap-4 py-1">
        {/* Anillo Circular SVG inspirado en la referencia Spider-Man */}
        <div className="relative w-20 h-20 shrink-0 flex items-center justify-center">
          <svg className="w-full h-full -rotate-90 transform" viewBox="0 0 80 80">
            {/* Círculo de fondo */}
            <circle
              cx="40"
              cy="40"
              r={radius}
              className="text-frost-steel/50 dark:text-steam-steel/40"
              strokeWidth="6"
              stroke="currentColor"
              fill="transparent"
            />
            {/* Círculo de progreso dinámico */}
            {hasReviews && (
              <circle
                cx="40"
                cy="40"
                r={radius}
                className="text-sky-accent dark:text-steam-blue transition-all duration-1000 ease-out"
                strokeWidth="6"
                strokeDasharray={circumference}
                strokeDashoffset={strokeDashoffset}
                strokeLinecap="round"
                stroke="currentColor"
                fill="transparent"
              />
            )}
          </svg>

          {/* Valor central */}
          <div className="absolute inset-0 flex flex-col items-center justify-center text-center">
            {hasReviews ? (
              <>
                <span className="text-xl font-black font-mono text-charcoal-text dark:text-pure-white tracking-tight leading-none">
                  {rating.toFixed(1)}
                </span>
                <span className="text-[9px] font-mono text-active-slate/70 dark:text-steam-light/60">
                  / 10
                </span>
              </>
            ) : (
              <span className="text-base font-bold font-mono text-active-slate/50 dark:text-steam-light/40">
                --
              </span>
            )}
          </div>
        </div>

        {/* Metadatos de la Puntuación */}
        <div className="flex-1 space-y-1">
          <div className="flex items-center gap-1.5">
            <span className="text-sm font-bold text-charcoal-text dark:text-pure-white font-sans">
              Promedio Comunitario
            </span>
            {hasReviews && (
              <Star
                className="w-3.5 h-3.5 text-amber-500 fill-amber-500 shrink-0"
                aria-hidden="true"
              />
            )}
          </div>

          {hasReviews ? (
            <p className="text-xs text-active-slate dark:text-steam-light font-mono">
              Basado en <strong className="text-sky-accent dark:text-steam-blue">{count}</strong>{' '}
              {count === 1 ? 'reseña' : 'reseñas de usuarios'}
            </p>
          ) : (
            <div className="space-y-0.5">
              <p className="text-xs font-semibold text-sky-accent dark:text-steam-blue flex items-center gap-1">
                <Sparkles className="w-3 h-3" />
                <span>Sin reseñas todavía</span>
              </p>
              <p className="text-[11px] text-active-slate/70 dark:text-steam-light/60 leading-tight">
                Sé el primer jugador en evaluar este título
              </p>
            </div>
          )}
        </div>
      </div>

      {/* Pie del bloque */}
      <div className="pt-2 border-t border-frost-steel/60 dark:border-steam-steel/30 flex items-center justify-between text-[10px] font-mono text-active-slate/60 dark:text-steam-light/50">
        <span>Evaluación GAUGE Verificada</span>
        <span className="text-emerald-500 font-semibold">100% Comunidad</span>
      </div>
    </div>
  );
}

