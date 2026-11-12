'use client';

import React, { useState, useEffect, useRef } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import {
  Search,
  Menu,
  User as UserIcon,
  LogOut,
  ShieldCheck,
  X,
  Star,
  Gamepad2,
  ArrowRight,
  Loader2,
} from 'lucide-react';
import { ThemeToggle } from './ThemeToggle';
import { BrandLogo } from './BrandLogo';
import { useAuth } from '@/features/auth';
import { gamesService, Game, getGameRating } from '@/features/games';

interface TopbarProps {
  onOpenMobileMenu?: () => void;
  className?: string;
}

export function Topbar({ onOpenMobileMenu, className = '' }: TopbarProps) {
  const { user, isAuthenticated, isAdmin, logout } = useAuth();
  const router = useRouter();

  const [searchQuery, setSearchQuery] = useState('');
  const [results, setResults] = useState<Game[]>([]);
  const [totalMatches, setTotalMatches] = useState(0);
  const [isSearching, setIsSearching] = useState(false);
  const [searchError, setSearchError] = useState<string | null>(null);
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [isMobileSearchOpen, setIsMobileSearchOpen] = useState(false);

  const searchContainerRef = useRef<HTMLDivElement>(null);
  const desktopInputRef = useRef<HTMLInputElement>(null);
  const mobileInputRef = useRef<HTMLInputElement>(null);

  // Atajo de teclado Ctrl+K / Cmd+K y cierre con Escape
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.ctrlKey || e.metaKey) && e.key.toLowerCase() === 'k') {
        e.preventDefault();
        if (window.innerWidth < 768) {
          setIsMobileSearchOpen(true);
          setTimeout(() => mobileInputRef.current?.focus(), 50);
        } else {
          desktopInputRef.current?.focus();
          if (searchQuery.trim()) {
            setIsDropdownOpen(true);
          }
        }
      } else if (e.key === 'Escape') {
        setIsDropdownOpen(false);
        setIsMobileSearchOpen(false);
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [searchQuery]);

  // Cerrar dropdown al hacer clic fuera del contenedor
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        searchContainerRef.current &&
        !searchContainerRef.current.contains(event.target as Node)
      ) {
        setIsDropdownOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  // Consulta reactiva con debounce al backend real
  useEffect(() => {
    const trimmed = searchQuery.trim();
    if (!trimmed) {
      setResults([]);
      setTotalMatches(0);
      setIsSearching(false);
      setSearchError(null);
      return;
    }

    let isCancelled = false;
    setIsSearching(true);
    setSearchError(null);

    const timer = setTimeout(async () => {
      try {
        const res = await gamesService.getGames({
          search: trimmed,
          limit: 5,
          page: 1,
        });
        if (!isCancelled) {
          if (Array.isArray(res)) {
            setResults(res);
            setTotalMatches(res.length);
          } else {
            setResults(res.data || []);
            setTotalMatches(res.pagination?.total ?? (res.data?.length || 0));
          }
          setIsSearching(false);
        }
      } catch {
        if (!isCancelled) {
          setSearchError('No se pudo completar la búsqueda en este momento.');
          setResults([]);
          setIsSearching(false);
        }
      }
    }, 300);

    return () => {
      isCancelled = true;
      clearTimeout(timer);
    };
  }, [searchQuery]);

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const trimmed = searchQuery.trim();
    setIsDropdownOpen(false);
    setIsMobileSearchOpen(false);
    if (trimmed) {
      router.push(`/catalogo?search=${encodeURIComponent(trimmed)}`);
    } else {
      router.push('/catalogo');
    }
  };

  const handleClearSearch = () => {
    setSearchQuery('');
    setResults([]);
    setTotalMatches(0);
    setIsDropdownOpen(false);
    desktopInputRef.current?.focus();
  };

  const renderDropdownResults = () => {
    const trimmed = searchQuery.trim();
    if (!isDropdownOpen || !trimmed) return null;

    return (
      <div
        role="listbox"
        aria-label="Resultados de búsqueda rápida"
        className="absolute left-0 right-0 top-full mt-2 glass-panel rounded-2xl border border-frost-steel dark:border-steam-steel/60 shadow-2xl overflow-hidden z-50 divide-y divide-frost-steel/50 dark:divide-steam-steel/30"
      >
        {isSearching ? (
          <div className="p-4 flex items-center justify-center gap-2 text-xs font-mono text-active-slate dark:text-steam-light">
            <Loader2 className="w-4 h-4 animate-spin text-sky-accent dark:text-steam-blue" />
            <span>Buscando videojuegos en el catálogo...</span>
          </div>
        ) : searchError ? (
          <div className="p-4 text-center text-xs text-rose-500 dark:text-rose-400">
            {searchError}
          </div>
        ) : results.length === 0 ? (
          <div className="p-5 text-center space-y-1">
            <p className="text-xs font-bold text-charcoal-text dark:text-pure-white">
              Sin coincidencias para &ldquo;{trimmed}&rdquo;
            </p>
            <p className="text-[11px] text-active-slate/70 dark:text-steam-light/60">
              Intenta con otro título o explora el catálogo completo.
            </p>
          </div>
        ) : (
          <>
            <div className="max-h-72 overflow-y-auto divide-y divide-frost-steel/40 dark:divide-steam-steel/20">
              {results.map((game) => {
                const rating = getGameRating(game);
                return (
                  <Link
                    key={game.id}
                    href={`/catalogo/${game.id}`}
                    onClick={() => {
                      setIsDropdownOpen(false);
                      setIsMobileSearchOpen(false);
                    }}
                    className="flex items-center justify-between gap-3 px-3.5 py-2.5 hover:bg-frost-bg/80 dark:hover:bg-steam-steel/30 transition-colors group"
                  >
                    <div className="flex items-center gap-3 min-w-0">
                      <div className="w-9 h-11 rounded-lg overflow-hidden bg-frost-bg dark:bg-steam-dark border border-frost-steel dark:border-steam-steel/50 shrink-0 flex items-center justify-center">
                        {game.coverUrl ? (
                          /* eslint-disable-next-line @next/next/no-img-element */
                          <img
                            src={game.coverUrl}
                            alt=""
                            className="w-full h-full object-cover"
                          />
                        ) : (
                          <Gamepad2 className="w-4 h-4 text-active-slate/40" />
                        )}
                      </div>
                      <div className="min-w-0">
                        <p className="text-xs sm:text-sm font-bold text-charcoal-text dark:text-pure-white truncate group-hover:text-sky-accent dark:group-hover:text-steam-blue transition-colors">
                          {game.title}
                        </p>
                        <span className="text-[10px] font-mono text-active-slate/70 dark:text-steam-light/60">
                          {game.genre?.name || 'Catálogo General'}
                        </span>
                      </div>
                    </div>

                    {rating !== null && (
                      <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-lg bg-amber-500/10 text-amber-600 dark:text-amber-400 text-[11px] font-mono font-bold shrink-0">
                        <Star className="w-3 h-3 fill-amber-500 text-amber-500" />
                        {rating.toFixed(1)}
                      </span>
                    )}
                  </Link>
                );
              })}
            </div>

            <button
              type="button"
              onClick={handleSearchSubmit}
              className="w-full px-4 py-2.5 text-xs font-mono font-bold text-sky-accent dark:text-steam-blue hover:bg-frost-bg/70 dark:hover:bg-steam-steel/25 flex items-center justify-between transition-colors cursor-pointer"
            >
              <span>
                Ver todos los resultados en el catálogo ({totalMatches})
              </span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </>
        )}
      </div>
    );
  };

  return (
    <header
      ref={searchContainerRef}
      role="banner"
      className={`w-full glass-panel rounded-2xl md:rounded-3xl px-3 sm:px-6 py-2.5 sm:py-3 border border-frost-steel dark:border-steam-steel/40 shadow-lg flex flex-col gap-2.5 z-30 ${className}`}
    >
      <div className="w-full flex items-center justify-between gap-2 sm:gap-4">
        {/* 1. Lado Izquierdo: Logotipo visible ÚNICAMENTE en móvil (en escritorio está en el Sidebar) */}
        <div className="flex items-center lg:hidden shrink-0">
          <Link
            href="/"
            className="flex items-center gap-2 group focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-sky-accent dark:focus-visible:ring-steam-blue rounded-xl p-1"
            aria-label="Ir al inicio de GAUGE"
          >
            <BrandLogo size="sm" />
          </Link>
        </div>

        {/* 2. Centro: Barra de búsqueda funcional en escritorio/tablet */}
        <div className="flex-1 max-w-xl hidden md:block relative">
          <form onSubmit={handleSearchSubmit} role="search" className="relative group">
            <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-active-slate/60 dark:text-steam-light/60 group-focus-within:text-sky-accent dark:group-focus-within:text-steam-blue">
              <Search className="w-4 h-4" aria-hidden="true" />
            </div>
            <input
              ref={desktopInputRef}
              type="search"
              value={searchQuery}
              onChange={(e) => {
                setSearchQuery(e.target.value);
                setIsDropdownOpen(true);
              }}
              onFocus={() => {
                if (searchQuery.trim()) setIsDropdownOpen(true);
              }}
              aria-label="Buscar videojuegos por título o género"
              placeholder="Buscar títulos, géneros, análisis comunitarios..."
              className="w-full pl-10 pr-20 py-2 text-xs sm:text-sm rounded-xl bg-white dark:bg-steam-dark/70 border border-frost-steel dark:border-steam-steel/60 text-charcoal-text dark:text-pure-white placeholder-active-slate/50 dark:placeholder-steam-light/50 focus-visible:outline-none focus-visible:border-sky-accent dark:focus-visible:border-steam-blue focus-visible:ring-1 focus-visible:ring-sky-accent dark:focus-visible:ring-steam-blue transition-all"
            />
            <div className="absolute inset-y-0 right-0 pr-2.5 flex items-center gap-1.5">
              {searchQuery ? (
                <button
                  type="button"
                  onClick={handleClearSearch}
                  aria-label="Limpiar búsqueda"
                  className="p-1 rounded-lg text-active-slate/60 dark:text-steam-light/60 hover:text-charcoal-text dark:hover:text-pure-white transition-colors"
                >
                  <X className="w-3.5 h-3.5" aria-hidden="true" />
                </button>
              ) : (
                <kbd className="hidden sm:inline-flex items-center gap-0.5 px-1.5 py-0.5 text-[10px] font-mono text-active-slate/60 dark:text-steam-light/50 bg-frost-bg dark:bg-steam-steel/30 border border-frost-steel dark:border-steam-steel/40 rounded pointer-events-none">
                  Ctrl K
                </kbd>
              )}
            </div>
          </form>

          {renderDropdownResults()}
        </div>

        {/* 3. Lado Derecho: Controles, Búsqueda Móvil, Sesión y Menú Móvil */}
        <div className="flex items-center gap-1.5 sm:gap-2.5 ml-auto shrink-0">
          {/* Botón de búsqueda para móviles (< md) */}
          <button
            type="button"
            onClick={() => {
              setIsMobileSearchOpen((prev) => {
                const next = !prev;
                if (next) {
                  setTimeout(() => mobileInputRef.current?.focus(), 50);
                }
                return next;
              });
            }}
            aria-label={isMobileSearchOpen ? 'Cerrar buscador' : 'Abrir buscador'}
            aria-expanded={isMobileSearchOpen}
            className="md:hidden inline-flex items-center justify-center min-w-[38px] min-h-[38px] p-2 rounded-xl bg-white dark:bg-steam-steel/30 text-charcoal-text dark:text-steam-light hover:bg-frost-bg dark:hover:bg-steam-steel/60 border border-frost-steel dark:border-steam-steel/50 transition-colors"
          >
            {isMobileSearchOpen ? (
              <X className="w-4 h-4" aria-hidden="true" />
            ) : (
              <Search className="w-4 h-4" aria-hidden="true" />
            )}
          </button>

          {/* Toggle de Modo Oscuro / Claro */}
          <ThemeToggle />

          {/* Acceso a Iniciar Sesión / Perfil */}
          {isAuthenticated && user ? (
            <div className="flex items-center gap-1.5 sm:gap-2">
              <div className="inline-flex items-center gap-2 px-2.5 sm:px-3 py-1.5 rounded-xl bg-white dark:bg-steam-steel/30 border border-frost-steel dark:border-steam-steel/50 shadow-sm text-xs font-medium text-charcoal-text dark:text-pure-white">
                <div className="w-6 h-6 rounded-lg bg-sky-accent/20 dark:bg-steam-blue/20 flex items-center justify-center font-mono font-bold text-[11px] text-sky-accent dark:text-steam-blue shrink-0">
                  {user.name.substring(0, 2).toUpperCase()}
                </div>
                <span className="hidden sm:inline font-semibold truncate max-w-[110px]">
                  {user.name}
                </span>
                {isAdmin && (
                  <span className="hidden md:inline-flex items-center gap-0.5 px-1.5 py-0.5 rounded text-[10px] font-mono font-bold bg-amber-500/20 text-amber-600 dark:text-amber-400">
                    <ShieldCheck className="w-3 h-3" />
                    ADMIN
                  </span>
                )}
              </div>

              <button
                type="button"
                onClick={logout}
                aria-label="Cerrar sesión"
                title="Cerrar sesión"
                className="inline-flex items-center justify-center min-w-[38px] min-h-[38px] p-2 rounded-xl text-active-slate/70 dark:text-steam-light/70 hover:text-rose-500 dark:hover:text-rose-400 hover:bg-rose-500/10 border border-frost-steel dark:border-steam-steel/50 transition-colors cursor-pointer"
              >
                <LogOut className="w-4 h-4" aria-hidden="true" />
              </button>
            </div>
          ) : (
            <Link
              href="/login"
              aria-label="Acceder a mi cuenta de jugador"
              className="inline-flex items-center gap-2 min-h-[38px] sm:min-h-[42px] px-2.5 sm:px-4 py-2 rounded-xl text-xs sm:text-sm font-semibold bg-white dark:bg-steam-steel/30 text-charcoal-text dark:text-steam-light hover:bg-frost-bg dark:hover:bg-steam-steel/60 hover:text-deep-navy dark:hover:text-pure-white border border-frost-steel dark:border-steam-steel/50 transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-sky-accent dark:focus-visible:ring-steam-blue shrink-0 shadow-sm"
            >
              <UserIcon className="w-4 h-4 text-sky-accent dark:text-steam-blue shrink-0" aria-hidden="true" />
              <span className="hidden sm:inline">Iniciar Sesión</span>
            </Link>
          )}

          {/* Botón Hamburguesa: Posicionado a la derecha en móvil */}
          {onOpenMobileMenu && (
            <button
              type="button"
              onClick={onOpenMobileMenu}
              aria-label="Abrir menú de navegación"
              className="lg:hidden inline-flex items-center justify-center min-w-[38px] min-h-[38px] sm:min-w-[42px] sm:min-h-[42px] p-2 rounded-xl bg-white dark:bg-steam-steel/30 text-charcoal-text dark:text-steam-light hover:bg-frost-bg dark:hover:bg-steam-steel/60 hover:text-deep-navy dark:hover:text-pure-white border border-frost-steel dark:border-steam-steel/50 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-sky-accent dark:focus-visible:ring-steam-blue transition-colors shrink-0 shadow-sm"
            >
              <Menu className="w-5 h-5" aria-hidden="true" />
            </button>
          )}
        </div>
      </div>

      {/* Barra de búsqueda expandible en móvil (< md) */}
      {isMobileSearchOpen && (
        <div className="md:hidden relative pt-1 border-t border-frost-steel/50 dark:border-steam-steel/30">
          <form onSubmit={handleSearchSubmit} role="search" className="relative">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-active-slate/60 dark:text-steam-light/60">
              <Search className="w-4 h-4" aria-hidden="true" />
            </div>
            <input
              ref={mobileInputRef}
              type="search"
              value={searchQuery}
              onChange={(e) => {
                setSearchQuery(e.target.value);
                setIsDropdownOpen(true);
              }}
              onFocus={() => {
                if (searchQuery.trim()) setIsDropdownOpen(true);
              }}
              aria-label="Buscar videojuegos en móvil"
              placeholder="Buscar videojuegos por título..."
              className="w-full pl-9 pr-9 py-2 text-xs rounded-xl bg-white dark:bg-steam-dark/80 border border-frost-steel dark:border-steam-steel/60 text-charcoal-text dark:text-pure-white placeholder-active-slate/50 dark:placeholder-steam-light/50 focus-visible:outline-none focus-visible:border-sky-accent dark:focus-visible:border-steam-blue"
            />
            {searchQuery && (
              <button
                type="button"
                onClick={handleClearSearch}
                aria-label="Limpiar búsqueda"
                className="absolute inset-y-0 right-0 pr-2.5 flex items-center text-active-slate/60 dark:text-steam-light/60"
              >
                <X className="w-3.5 h-3.5" aria-hidden="true" />
              </button>
            )}
          </form>

          {renderDropdownResults()}
        </div>
      )}
    </header>
  );
}
