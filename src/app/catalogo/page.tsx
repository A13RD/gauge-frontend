'use client';

import React, { Suspense, useEffect, useState, useTransition } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { AppShell } from '@/features/common/components/AppShell';
import { useGames } from '@/features/games/hooks/useGames';
import { useGenres } from '@/features/games/hooks/useGenres';
import { GameFilters } from '@/features/games/components/GameFilters';
import { GameGrid } from '@/features/games/components/GameGrid';
import { Pagination } from '@/features/games/components/Pagination';
import { LoadingSkeleton } from '@/features/common/components/LoadingSkeleton';
import { Compass, Sparkles } from 'lucide-react';

function CatalogoContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [, startTransition] = useTransition();

  // 1. Obtener parámetros iniciales de la URL
  const initialSearch = searchParams.get('search') || '';
  const initialGenre = searchParams.get('genre') || '';
  const initialSort = (searchParams.get('sort') as 'recent' | 'popular') || 'recent';
  const initialPage = Number(searchParams.get('page')) || 1;

  // Estado local para búsqueda inmediata en el input
  const [searchInput, setSearchInput] = useState(initialSearch);

  // 2. Hook de videojuegos
  const {
    games,
    pagination,
    isLoading,
    error,
    statusCode,
    filter,
    setFilter,
    refetch,
  } = useGames({
    search: initialSearch,
    genre: initialGenre,
    sort: initialSort,
    page: initialPage,
    limit: 12,
  });

  // 3. Hook de géneros dinámicos desde el backend
  const { genres, isLoading: isLoadingGenres } = useGenres();

  // Sincronizar cambios en los filtros con la URL del navegador
  const updateUrlParams = (newFilter: {
    search?: string;
    genre?: string;
    sort?: 'recent' | 'popular';
    page?: number;
  }) => {
    const params = new URLSearchParams(searchParams.toString());

    if (newFilter.search !== undefined) {
      if (newFilter.search.trim()) params.set('search', newFilter.search.trim());
      else params.delete('search');
    }
    if (newFilter.genre !== undefined) {
      if (newFilter.genre.trim()) params.set('genre', newFilter.genre.trim());
      else params.delete('genre');
    }
    if (newFilter.sort !== undefined) {
      if (newFilter.sort !== 'recent') params.set('sort', newFilter.sort);
      else params.delete('sort');
    }
    if (newFilter.page !== undefined) {
      if (newFilter.page > 1) params.set('page', String(newFilter.page));
      else params.delete('page');
    }

    const query = params.toString();
    startTransition(() => {
      router.replace(query ? `/catalogo?${query}` : '/catalogo', { scroll: false });
    });
  };

  // Manejar cambio en la búsqueda con debounce sutil
  useEffect(() => {
    const timer = setTimeout(() => {
      if (searchInput !== filter.search) {
        setFilter((prev) => ({ ...prev, search: searchInput, page: 1 }));
        updateUrlParams({ search: searchInput, page: 1 });
      }
    }, 350);

    return () => clearTimeout(timer);
  }, [searchInput]); // eslint-disable-line react-hooks/exhaustive-deps

  // Manejador de cambio de género
  const handleGenreChange = (newGenre?: string) => {
    const genreValue = newGenre || '';
    setFilter((prev) => ({ ...prev, genre: genreValue, page: 1 }));
    updateUrlParams({ genre: genreValue, page: 1 });
  };

  // Manejador de cambio de ordenamiento
  const handleSortChange = (newSort: 'recent' | 'popular') => {
    setFilter((prev) => ({ ...prev, sort: newSort, page: 1 }));
    updateUrlParams({ sort: newSort, page: 1 });
  };

  // Manejador de cambio de página
  const handlePageChange = (newPage: number) => {
    setFilter((prev) => ({ ...prev, page: newPage }));
    updateUrlParams({ page: newPage });
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  // Limpiar todos los filtros aplicados
  const handleClearFilters = () => {
    setSearchInput('');
    setFilter({
      search: '',
      genre: '',
      sort: 'recent',
      page: 1,
      limit: 12,
    });
    updateUrlParams({ search: '', genre: '', sort: 'recent', page: 1 });
  };

  const isFiltered = Boolean(filter.search || filter.genre || (filter.sort && filter.sort !== 'recent'));

  return (
    <div className="flex flex-col gap-6 sm:gap-8">
      {/* Encabezado del Catálogo */}
      <div className="flex flex-col gap-2">
        <div className="inline-flex items-center gap-1.5 text-xs font-mono font-bold text-sky-accent dark:text-steam-blue uppercase tracking-wider">
          <Compass className="w-4 h-4" aria-hidden="true" />
          BASE DE DATOS TÉCNICA · GAUGE
        </div>
        <h1 className="text-2xl sm:text-3xl md:text-4xl font-black text-charcoal-text dark:text-pure-white font-sans uppercase">
          Catálogo de Videojuegos
        </h1>
        <p className="text-xs sm:text-sm text-active-slate dark:text-steam-light max-w-2xl leading-relaxed">
          Explora los títulos disponibles, consulta puntuaciones calculadas por la comunidad y filtra por categorías técnicas y popularidad.
        </p>
      </div>

      {/* Barra de Filtros, Búsqueda y Géneros */}
      <section
        aria-label="Filtros del catálogo"
        className="glass-panel rounded-2xl p-4 sm:p-5 border border-frost-steel dark:border-steam-steel/40 shadow-md"
      >
        <GameFilters
          search={searchInput}
          onSearchChange={setSearchInput}
          selectedGenre={filter.genre}
          onGenreChange={handleGenreChange}
          selectedSort={filter.sort}
          onSortChange={handleSortChange}
          genres={genres}
          isLoadingGenres={isLoadingGenres}
        />
      </section>

      {/* Grilla Principal de Videojuegos */}
      <section aria-label="Listado de videojuegos">
        <GameGrid
          games={games}
          isLoading={isLoading}
          error={error}
          statusCode={statusCode}
          onRetry={refetch}
          onClearFilters={handleClearFilters}
          isFiltered={isFiltered}
        />
      </section>

      {/* Paginación */}
      {pagination && (
        <Pagination
          pagination={pagination}
          onPageChange={handlePageChange}
          isLoading={isLoading}
        />
      )}
    </div>
  );
}

export default function CatalogoPage() {
  return (
    <AppShell>
      <Suspense
        fallback={
          <div className="py-8">
            <LoadingSkeleton count={3} />
          </div>
        }
      >
        <CatalogoContent />
      </Suspense>
    </AppShell>
  );
}
