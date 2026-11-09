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
      className={`w-full glass-panel rounded-2xl md:rounded-3xl px-3 sm:px-6 py-2.5 sm:py-3 border border-frost-steel dark:border-steam-steel/40 shadow-lg flex items-center justify-between gap-3 sm:gap-4 z-20 ${className}`}
    >
      {/* 1. Lado Izquierdo: Logotipo visible ÚNICAMENTE en móvil (en escritorio está en el Sidebar) */}
      <div className="flex items-center lg:hidden">
        <Link
          href="/"
          className="flex items-center gap-2 group focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-sky-accent dark:focus-visible:ring-steam-blue rounded-xl p-1"
          aria-label="Ir al inicio de GAUGE"
        >
          <div className="w-9 h-9 rounded-xl bg-steam-blue/20 border border-steam-blue/40 flex items-center justify-center text-sky-accent dark:text-steam-blue group-hover:scale-105 transition-transform shadow-[0_0_12px_rgba(102,192,244,0.3)]">
            <Gauge className="w-5 h-5" aria-hidden="true" />
          </div>
          <span className="font-extrabold tracking-wider text-base text-charcoal-text dark:text-pure-white font-mono">
            GAUGE
          </span>
        </Link>
      </div>

      {/* 2. Centro: Barra de búsqueda (Expandida en escritorio, oculta o compacta en móvil) */}
      <div className="flex-1 max-w-xl hidden md:block">
        <div className="relative group">
          <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-active-slate/60 dark:text-steam-light/60 group-focus-within:text-sky-accent dark:group-focus-within:text-steam-blue">
            <Search className="w-4 h-4" aria-hidden="true" />
          </div>
          <input
            type="search"
            aria-label="Buscar videojuegos o reseñas"
            placeholder="Buscar títulos, géneros, análisis comunitarios..."
            className="w-full pl-10 pr-14 py-2 text-xs sm:text-sm rounded-xl bg-white dark:bg-steam-dark/70 border border-frost-steel dark:border-steam-steel/60 text-charcoal-text dark:text-pure-white placeholder-active-slate/50 dark:placeholder-steam-light/50 focus-visible:outline-none focus-visible:border-sky-accent dark:focus-visible:border-steam-blue focus-visible:ring-1 focus-visible:ring-sky-accent dark:focus-visible:ring-steam-blue transition-all"
            readOnly
          />
          <div className="absolute inset-y-0 right-0 pr-3 flex items-center pointer-events-none">
            <kbd className="hidden sm:inline-flex items-center gap-0.5 px-1.5 py-0.5 text-[10px] font-mono text-active-slate/60 dark:text-steam-light/50 bg-frost-bg dark:bg-steam-steel/30 border border-frost-steel dark:border-steam-steel/40 rounded">
              Ctrl K
            </kbd>
          </div>
        </div>
      </div>

      {/* 3. Lado Derecho: Controles, Sesión y Menú Móvil */}
      <div className="flex items-center gap-2 sm:gap-3 ml-auto">
        {/* Toggle de Modo Oscuro / Claro */}
        <ThemeToggle />

        {/* Acceso a Iniciar Sesión / Perfil */}
        <Link
          href="/login"
          aria-label="Acceder a mi cuenta de jugador"
          className="inline-flex items-center gap-2 min-h-[42px] px-3 sm:px-4 py-2 rounded-xl text-xs sm:text-sm font-semibold bg-white dark:bg-steam-steel/30 text-charcoal-text dark:text-steam-light hover:bg-frost-bg dark:hover:bg-steam-steel/60 hover:text-deep-navy dark:hover:text-pure-white border border-frost-steel dark:border-steam-steel/50 transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-sky-accent dark:focus-visible:ring-steam-blue shrink-0 shadow-sm"
        >
          <UserIcon className="w-4 h-4 text-sky-accent dark:text-steam-blue shrink-0" aria-hidden="true" />
          <span className="hidden sm:inline">Iniciar Sesión</span>
        </Link>

        {/* Botón Hamburguesa: Posicionado a la derecha en móvil según boceto oficial */}
        {onOpenMobileMenu && (
          <button
            type="button"
            onClick={onOpenMobileMenu}
            aria-label="Abrir menú de navegación"
            className="lg:hidden inline-flex items-center justify-center min-w-[42px] min-h-[42px] p-2 rounded-xl bg-white dark:bg-steam-steel/30 text-charcoal-text dark:text-steam-light hover:bg-frost-bg dark:hover:bg-steam-steel/60 hover:text-deep-navy dark:hover:text-pure-white border border-frost-steel dark:border-steam-steel/50 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-sky-accent dark:focus-visible:ring-steam-blue transition-colors shrink-0 shadow-sm"
          >
            <Menu className="w-5 h-5" aria-hidden="true" />
          </button>
        )}
      </div>
    </header>
  );
}
