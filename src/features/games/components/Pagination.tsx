'use client';

import React from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { PaginationMeta } from '../domain/game.types';

export interface PaginationProps {
  pagination: PaginationMeta;
  onPageChange: (page: number) => void;
  isLoading?: boolean;
  className?: string;
}

export function Pagination({
  pagination,
  onPageChange,
  isLoading = false,
  className = '',
}: PaginationProps) {
  const { totalPages, currentPage, total, limit } = pagination;

  // Si no hay páginas o solo hay 1 página, no es necesario renderizar controles de navegación
  if (!totalPages || totalPages <= 1) {
    if (total > 0) {
      return (
        <div className="flex justify-center py-4 text-xs font-mono text-active-slate/70 dark:text-steam-light/60">
          Mostrando todos los {total} videojuegos
        </div>
      );
    }
    return null;
  }

  // Generar lista de páginas visibles (con un rango razonable alrededor de la actual)
  const getVisiblePages = () => {
    const pages: (number | 'ellipsis')[] = [];
    const maxVisible = 5;

    if (totalPages <= maxVisible) {
      for (let i = 1; i <= totalPages; i++) pages.push(i);
      return pages;
    }

    pages.push(1);

    if (currentPage > 3) {
      pages.push('ellipsis');
    }

    const start = Math.max(2, currentPage - 1);
    const end = Math.min(totalPages - 1, currentPage + 1);

    for (let i = start; i <= end; i++) {
      pages.push(i);
    }

    if (currentPage < totalPages - 2) {
      pages.push('ellipsis');
    }

    pages.push(totalPages);
    return pages;
  };

  const startItem = Math.min((currentPage - 1) * limit + 1, total);
  const endItem = Math.min(currentPage * limit, total);

  return (
    <nav
      aria-label="Paginación del catálogo"
      className={`flex flex-col sm:flex-row items-center justify-between gap-4 py-4 pt-6 border-t border-frost-steel/60 dark:border-steam-steel/30 ${className}`}
    >
      {/* Resumen de cantidad */}
      <span className="text-xs font-mono text-active-slate/80 dark:text-steam-light/70">
        Mostrando <strong className="text-charcoal-text dark:text-pure-white">{startItem}</strong> -{' '}
        <strong className="text-charcoal-text dark:text-pure-white">{endItem}</strong> de{' '}
        <strong className="text-charcoal-text dark:text-pure-white">{total}</strong> videojuegos
      </span>

      {/* Botones de navegación */}
      <div className="flex items-center gap-1.5">
        {/* Botón Anterior */}
        <button
          type="button"
          onClick={() => onPageChange(currentPage - 1)}
          disabled={currentPage <= 1 || isLoading}
          aria-label="Página anterior"
          className="inline-flex items-center gap-1 px-3 py-1.5 rounded-xl text-xs font-mono font-medium bg-white dark:bg-steam-navy/80 border border-frost-steel dark:border-steam-steel/50 text-charcoal-text dark:text-pure-white hover:border-sky-accent dark:hover:border-steam-blue disabled:opacity-40 disabled:pointer-events-none transition-colors"
        >
          <ChevronLeft className="w-3.5 h-3.5" aria-hidden="true" />
          <span className="hidden sm:inline">Anterior</span>
        </button>

        {/* Números de Página */}
        <div className="flex items-center gap-1">
          {getVisiblePages().map((item, idx) => {
            if (item === 'ellipsis') {
              return (
                <span
                  key={`ellipsis-${idx}`}
                  className="px-2 py-1 text-xs font-mono text-active-slate/50 dark:text-steam-light/50"
                >
                  …
                </span>
              );
            }

            const isCurrent = item === currentPage;
            return (
              <button
                key={item}
                type="button"
                onClick={() => onPageChange(item)}
                disabled={isLoading}
                aria-current={isCurrent ? 'page' : undefined}
                className={`min-w-[32px] h-8 px-2 rounded-xl text-xs font-mono font-semibold transition-all ${
                  isCurrent
                    ? 'bg-sky-accent text-white dark:bg-steam-blue dark:text-steam-dark shadow-[0_0_8px_rgba(2,132,199,0.5)] border border-sky-accent dark:border-steam-blue'
                    : 'bg-white dark:bg-steam-navy/70 text-charcoal-text dark:text-pure-white border border-frost-steel dark:border-steam-steel/40 hover:border-sky-accent/60'
                }`}
              >
                {item}
              </button>
            );
          })}
        </div>

        {/* Botón Siguiente */}
        <button
          type="button"
          onClick={() => onPageChange(currentPage + 1)}
          disabled={currentPage >= totalPages || isLoading}
          aria-label="Página siguiente"
          className="inline-flex items-center gap-1 px-3 py-1.5 rounded-xl text-xs font-mono font-medium bg-white dark:bg-steam-navy/80 border border-frost-steel dark:border-steam-steel/50 text-charcoal-text dark:text-pure-white hover:border-sky-accent dark:hover:border-steam-blue disabled:opacity-40 disabled:pointer-events-none transition-colors"
        >
          <span className="hidden sm:inline">Siguiente</span>
          <ChevronRight className="w-3.5 h-3.5" aria-hidden="true" />
        </button>
      </div>
    </nav>
  );
}

