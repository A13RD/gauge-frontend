'use client';

import React from 'react';
import { Search, X, Filter, ArrowUpDown } from 'lucide-react';
import { Genre } from '../domain/game.types';

export interface GameFiltersProps {
  search: string;
  onSearchChange: (search: string) => void;
  selectedGenre?: string;
  onGenreChange: (genreSlugOrId?: string) => void;
  selectedSort?: 'recent' | 'popular';
  onSortChange: (sort: 'recent' | 'popular') => void;
  genres: Genre[];
  isLoadingGenres?: boolean;
  className?: string;
}

export function GameFilters({
  search,
  onSearchChange,
  selectedGenre = '',
  onGenreChange,
  selectedSort = 'recent',
  onSortChange,
  genres = [],
  isLoadingGenres = false,
  className = '',
}: GameFiltersProps) {
  return (
    <div className={`flex flex-col gap-4 ${className}`}>
      {/* Fila Superior: Búsqueda y Selector de Orden */}
      <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3">
        {/* Barra de Búsqueda */}
        <div className="relative flex-1">
          <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-active-slate/60 dark:text-steam-light/50">
            <Search className="w-4 h-4" aria-hidden="true" />
          </div>
          <input
            type="text"
            value={search}
            onChange={(e) => onSearchChange(e.target.value)}
            placeholder="Buscar por título de videojuego..."
            aria-label="Buscar videojuegos por título"
            className="w-full pl-10 pr-10 py-2.5 rounded-xl text-sm bg-white dark:bg-steam-navy/80 border border-frost-steel dark:border-steam-steel/50 text-charcoal-text dark:text-pure-white placeholder-active-slate/50 dark:placeholder-steam-light/40 focus:outline-none focus:ring-2 focus:ring-sky-accent dark:focus:ring-steam-blue focus:border-transparent transition-all shadow-xs"
          />
          {search && (
            <button
              type="button"
              onClick={() => onSearchChange('')}
              aria-label="Limpiar búsqueda"
              className="absolute inset-y-0 right-0 pr-3 flex items-center text-active-slate/60 hover:text-charcoal-text dark:text-steam-light/60 dark:hover:text-pure-white transition-colors"
            >
              <X className="w-4 h-4" aria-hidden="true" />
            </button>
          )}
        </div>

        {/* Selector de Orden */}
        <div className="flex items-center gap-2 shrink-0">
          <div className="relative inline-flex items-center">
            <span className="absolute left-3 text-active-slate/60 dark:text-steam-light/50 pointer-events-none">
              <ArrowUpDown className="w-3.5 h-3.5" aria-hidden="true" />
            </span>
            <select
              value={selectedSort}
              onChange={(e) => onSortChange(e.target.value as 'recent' | 'popular')}
              aria-label="Ordenar videojuegos"
              className="pl-8 pr-8 py-2.5 rounded-xl text-xs sm:text-sm bg-white dark:bg-steam-navy/80 border border-frost-steel dark:border-steam-steel/50 text-charcoal-text dark:text-pure-white font-mono focus:outline-none focus:ring-2 focus:ring-sky-accent dark:focus:ring-steam-blue shadow-xs cursor-pointer appearance-none"
            >
              <option value="recent">Más recientes</option>
              <option value="popular">Más populares</option>
            </select>
            <span className="absolute right-3 pointer-events-none text-[10px] text-active-slate/50 dark:text-steam-light/50">
              ▼
            </span>
          </div>
        </div>
      </div>

      {/* Fila Inferior: Filtros de Género en Chips/Pills */}
      <div className="flex items-center gap-2 overflow-x-auto pb-1 scrollbar-none -mx-1 px-1">
        <span className="text-xs font-mono font-semibold text-active-slate/70 dark:text-steam-light/60 flex items-center gap-1 shrink-0 pr-1">
          <Filter className="w-3.5 h-3.5" aria-hidden="true" />
          Géneros:
        </span>

        {/* Opción "Todos" */}
        <button
          type="button"
          onClick={() => onGenreChange('')}
          className={`px-3 py-1.5 rounded-xl text-xs font-mono font-medium shrink-0 transition-all cursor-pointer ${
            !selectedGenre
              ? 'bg-sky-accent text-white dark:bg-steam-blue dark:text-steam-dark shadow-[0_0_10px_rgba(2,132,199,0.4)] border border-sky-accent dark:border-steam-blue font-bold'
              : 'bg-white dark:bg-steam-navy/70 text-charcoal-text dark:text-pure-white/80 border border-frost-steel dark:border-steam-steel/40 hover:border-sky-accent/50'
          }`}
        >
          Todos
        </button>

        {/* Géneros dinámicos */}
        {isLoadingGenres ? (
          Array.from({ length: 4 }).map((_, i) => (
            <div
              key={i}
              className="h-7 w-20 rounded-xl bg-frost-steel/40 dark:bg-steam-steel/30 animate-pulse shrink-0"
            />
          ))
        ) : (
          genres.map((genre) => {
            const isSelected =
              selectedGenre === genre.slug || selectedGenre === genre.id;
            return (
              <button
                key={genre.id}
                type="button"
                onClick={() => onGenreChange(isSelected ? '' : genre.slug || genre.id)}
                className={`px-3 py-1.5 rounded-xl text-xs font-mono font-medium shrink-0 transition-all cursor-pointer ${
                  isSelected
                    ? 'bg-sky-accent text-white dark:bg-steam-blue dark:text-steam-dark shadow-[0_0_10px_rgba(2,132,199,0.4)] border border-sky-accent dark:border-steam-blue font-bold'
                    : 'bg-white dark:bg-steam-navy/70 text-charcoal-text dark:text-pure-white/80 border border-frost-steel dark:border-steam-steel/40 hover:border-sky-accent/50'
                }`}
              >
                {genre.name}
              </button>
            );
          })
        )}
      </div>
    </div>
  );
}

