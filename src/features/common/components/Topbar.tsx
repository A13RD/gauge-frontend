'use client';

import React from 'react';
import Link from 'next/link';
import { Search, Menu, Gauge, User as UserIcon } from 'lucide-react';
import { ThemeToggle } from './ThemeToggle';

interface TopbarProps {
  onOpenMobileMenu?: () => void;
  className?: string;
}

export function Topbar({ onOpenMobileMenu, className = '' }: TopbarProps) {
  return (
    <header
      role="banner"
      className={`w-full glass-panel rounded-2xl md:rounded-3xl px-4 sm:px-6 py-3 border border-steam-steel/40 dark:border-steam-steel/40 light:border-frost-steel shadow-lg flex items-center justify-between gap-4 z-20 ${className}`}
    >
      {/* Lado izquierdo: Botón menú móvil y Logo */}
      <div className="flex items-center gap-3">
        {onOpenMobileMenu && (
          <button
            type="button"
            onClick={onOpenMobileMenu}
            aria-label="Abrir menú de navegación"
            className="lg:hidden p-2 rounded-xl text-steam-light light:text-active-slate hover:text-white hover:bg-steam-steel/30 dark:hover:bg-steam-steel/30 light:hover:bg-frost-bg border border-steam-steel/40 dark:border-steam-steel/40 light:border-frost-steel focus:outline-none focus:ring-2 focus:ring-steam-blue transition-colors"
          >
            <Menu className="w-5 h-5" />
          </button>
        )}

        <Link
          href="/"
          className="flex items-center gap-2.5 group focus:outline-none focus:ring-2 focus:ring-steam-blue rounded-xl p-1"
        >
          <div className="w-9 h-9 rounded-xl bg-steam-blue/20 border border-steam-blue/40 flex items-center justify-center text-steam-blue group-hover:scale-105 transition-transform shadow-[0_0_12px_rgba(102,192,244,0.3)]">
            <Gauge className="w-5 h-5" />
          </div>
          <div className="flex flex-col">
            <span className="font-extrabold tracking-wider text-base text-white light:text-charcoal-text font-mono">
              GAUGE
            </span>
            <span className="hidden sm:inline text-[9px] uppercase tracking-widest text-steam-light/60 light:text-active-slate/60 font-medium">
              Gameplay Matrix
            </span>
          </div>
        </Link>
      </div>

      {/* Centro: Barra de búsqueda visual preparada para el futuro */}
      <div className="flex-1 max-w-md hidden md:block">
        <div className="relative group">
          <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-steam-light/60 light:text-active-slate/60 group-focus-within:text-steam-blue">
            <Search className="w-4 h-4" />
          </div>
          <input
            type="search"
            aria-label="Buscar videojuegos o reseñas"
            placeholder="Buscar títulos, géneros o análisis..."
            className="w-full pl-10 pr-12 py-2 text-xs sm:text-sm rounded-xl bg-steam-dark/60 dark:bg-steam-dark/60 light:bg-frost-bg/80 border border-steam-steel/50 dark:border-steam-steel/50 light:border-frost-steel text-white light:text-charcoal-text placeholder-steam-light/50 light:placeholder-active-slate/50 focus:outline-none focus:border-steam-blue focus:ring-1 focus:ring-steam-blue transition-all"
            readOnly
          />
          <div className="absolute inset-y-0 right-0 pr-3 flex items-center pointer-events-none">
            <kbd className="hidden sm:inline-flex items-center gap-0.5 px-1.5 py-0.5 text-[10px] font-mono text-steam-light/50 light:text-active-slate/50 bg-steam-steel/30 dark:bg-steam-steel/30 light:bg-frost-steel/40 border border-steam-steel/40 dark:border-steam-steel/40 light:border-frost-steel rounded">
              Ctrl K
            </kbd>
          </div>
        </div>
      </div>

      {/* Lado derecho: Acceso a perfil y selector de tema */}
      <div className="flex items-center gap-2 sm:gap-3">
        {/* Toggle de Modo Oscuro / Claro */}
        <ThemeToggle />

        {/* Acceso de sesión / Perfil */}
        <Link
          href="/login"
          aria-label="Acceder a mi cuenta"
          className="flex items-center gap-2 px-3 py-2 rounded-xl text-xs sm:text-sm font-semibold bg-steam-steel/30 dark:bg-steam-steel/30 light:bg-frost-bg hover:bg-steam-steel/60 dark:hover:bg-steam-steel/60 light:hover:bg-frost-steel/30 text-steam-light light:text-active-slate hover:text-white light:hover:text-charcoal-text border border-steam-steel/50 dark:border-steam-steel/50 light:border-frost-steel transition-all focus:outline-none focus:ring-2 focus:ring-steam-blue"
        >
          <UserIcon className="w-4 h-4 text-steam-blue light:text-sky-accent" />
          <span className="hidden sm:inline">Iniciar Sesión</span>
        </Link>
      </div>
    </header>
  );
}

