'use client';

import React, { useState } from 'react';
import { Game } from '../domain/game.types';
import { Play, Film, X, ExternalLink } from 'lucide-react';

interface GameTrailerCardProps {
  game: Game;
}

/**
 * Mapeo de respaldo con IDs oficiales de tráileres verificados para títulos conocidos
 */
const KNOWN_GAME_TRAILERS: Record<string, string> = {
  'spider-man': 'qIQ3xNqkVC4',
  'spiderman': 'qIQ3xNqkVC4',
  'miles morales': 'qIQ3xNqkVC4',
  'valorant': 'e_E9W2vsRbA',
  'elden ring': 'AKXiKBnzpBQ',
  'hollow knight': 'UAO2urG23S4',
  'cyberpunk': '8X2kIfS6fb8',
  'god of war': 'K0u_kODnGQU',
  'the witcher': 'c0i88t0Kacs',
  'zelda': 'uHGShqcAHlQ',
};

/**
 * Extrae el ID de un vídeo de YouTube a partir de una URL válida
 */
function extractYouTubeId(url?: string | null): string | null {
  if (!url) return null;
  const regExp = /(?:youtube\.com\/(?:watch\?v=|embed\/|shorts\/)|youtu\.be\/)([a-zA-Z0-9_-]{11})/;
  const match = url.match(regExp);
  return match ? match[1] : null;
}

/**
 * Resuelve el ID del tráiler a partir de la URL del juego o de títulos conocidos
 */
function resolveTrailerId(game: Game): string | null {
  if (game.trailerUrl) {
    const extracted = extractYouTubeId(game.trailerUrl);
    if (extracted) return extracted;
  }

  const normalizedTitle = (game.title || '').toLowerCase();
  for (const [key, id] of Object.entries(KNOWN_GAME_TRAILERS)) {
    if (normalizedTitle.includes(key)) {
      return id;
    }
  }

  return null;
}

export function GameTrailerCard({ game }: GameTrailerCardProps) {
  const [isOpen, setIsOpen] = useState(false);
  const trailerId = resolveTrailerId(game);

  // Miniatura del tráiler: preferencia a miniatura oficial de YouTube, luego banner, luego cover
  const thumbnail = trailerId
    ? `https://img.youtube.com/vi/${trailerId}/hqdefault.jpg`
    : game.bannerUrl || game.coverUrl;

  const searchUrl = `https://www.youtube.com/results?search_query=${encodeURIComponent(
    (game.title || '') + ' official trailer gameplay'
  )}`;

  return (
    <>
      <div className="glass-panel rounded-2xl p-4 sm:p-5 border border-frost-steel/80 dark:border-steam-steel/60 bg-white/70 dark:bg-steam-navy/80 backdrop-blur-md shadow-xl flex flex-col gap-3 group hover:border-sky-accent dark:hover:border-steam-blue transition-all">
        {/* Cabecera del bloque */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Film className="w-4 h-4 text-sky-accent dark:text-steam-blue" aria-hidden="true" />
            <span className="text-[11px] font-mono font-bold uppercase tracking-wider text-charcoal-text dark:text-pure-white">
              Watch Trailer
            </span>
          </div>
          <span className="text-[10px] font-mono px-2 py-0.5 rounded-full bg-sky-accent/15 dark:bg-steam-blue/20 text-sky-accent dark:text-steam-blue font-semibold">
            HD 1080p
          </span>
        </div>

        {/* Tarjeta de previsualización 16:9 interactiva */}
        <div
          role="button"
          tabIndex={0}
          onClick={() => {
            if (trailerId) {
              setIsOpen(true);
            } else if (typeof window !== 'undefined') {
              window.open(searchUrl, '_blank', 'noopener,noreferrer');
            }
          }}
          onKeyDown={(e) => {
            if (e.key === 'Enter' || e.key === ' ') {
              e.preventDefault();
              if (trailerId) setIsOpen(true);
            }
          }}
          className="relative aspect-video rounded-xl overflow-hidden bg-steam-dark border border-frost-steel dark:border-steam-steel/40 cursor-pointer shadow-inner group/thumb"
          aria-label={`Ver tráiler oficial de ${game.title}`}
        >
          {/* Imagen de fondo */}
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src={thumbnail}
            alt={`Tráiler de ${game.title}`}
            className="w-full h-full object-cover group-hover/thumb:scale-105 transition-transform duration-300 opacity-90 group-hover/thumb:opacity-100"
          />

          {/* Degradado sobre la miniatura */}
          <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/30 to-transparent" />

          {/* Botón flotante central de Play */}
          <div className="absolute inset-0 flex items-center justify-center">
            <div className="w-12 h-12 sm:w-14 sm:h-14 rounded-full bg-sky-accent/90 dark:bg-steam-blue/90 text-white dark:text-steam-dark flex items-center justify-center shadow-[0_0_20px_rgba(102,192,244,0.6)] group-hover/thumb:scale-110 group-hover/thumb:bg-sky-accent dark:group-hover/thumb:bg-steam-blue transition-all">
              <Play className="w-5 h-5 sm:w-6 sm:h-6 fill-current ml-0.5" aria-hidden="true" />
            </div>
          </div>

          {/* Título en la parte inferior de la miniatura */}
          <div className="absolute bottom-2 left-2.5 right-2.5 flex items-center justify-between text-white text-[11px] font-mono">
            <span className="truncate max-w-[200px] font-semibold">
              {game.title} — Tráiler Oficial
            </span>
            <span className="text-[10px] text-steam-light/80 shrink-0">Reproducir</span>
          </div>
        </div>

        {/* Pie informativo */}
        <p className="text-[11px] text-active-slate/70 dark:text-steam-light/70 flex items-center justify-between">
          <span>{trailerId ? 'Contenido audiovisual verificado' : 'Disponible en plataforma externa'}</span>
          {!trailerId && (
            <a
              href={searchUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-1 text-sky-accent dark:text-steam-blue hover:underline"
            >
              <span>Buscar en YouTube</span>
              <ExternalLink className="w-3 h-3" />
            </a>
          )}
        </p>
      </div>

      {/* Modal con reproductor seguro de YouTube */}
      {isOpen && trailerId && (
        <div
          role="dialog"
          aria-modal="true"
          className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md animate-fade-in"
        >
          <div className="relative w-full max-w-4xl glass-panel rounded-3xl overflow-hidden border border-steam-steel/60 shadow-2xl bg-steam-dark">
            {/* Barra superior del modal */}
            <div className="flex items-center justify-between px-5 py-3 border-b border-steam-steel/40 bg-steam-navy/80">
              <div className="flex items-center gap-2">
                <Film className="w-4 h-4 text-steam-blue" aria-hidden="true" />
                <h3 className="text-sm font-bold font-mono text-white truncate max-w-md">
                  {game.title} — Tráiler Oficial
                </h3>
              </div>
              <button
                type="button"
                onClick={() => setIsOpen(false)}
                className="p-1 rounded-lg text-steam-light/70 hover:text-white hover:bg-steam-steel/40 transition-colors"
                aria-label="Cerrar tráiler"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Contenedor responsivo 16:9 con iframe */}
            <div className="aspect-video w-full bg-black">
              <iframe
                src={`https://www.youtube-nocookie.com/embed/${trailerId}?autoplay=1&rel=0&modestbranding=1`}
                title={`Tráiler de ${game.title}`}
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                allowFullScreen
                className="w-full h-full border-0"
              />
            </div>
          </div>
        </div>
      )}
    </>
  );
}

