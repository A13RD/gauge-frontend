'use client';

import React, { useEffect, useRef } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import {
  House,
  Gamepad2,
  Plus,
  MessageSquareText,
  X,
  Gauge,
  User as UserIcon,
} from 'lucide-react';
import { ThemeToggle } from './ThemeToggle';
import { NAV_ITEMS } from './Sidebar';

interface MobileNavProps {
  isOpen: boolean;
  onClose: () => void;
  isAdmin?: boolean;
}

export function MobileNav({ isOpen, onClose, isAdmin = false }: MobileNavProps) {
  const pathname = usePathname();
  const prevPathnameRef = useRef(pathname);

  // Cerrar el drawer únicamente cuando la ruta cambie efectivamente
  useEffect(() => {
    if (prevPathnameRef.current !== pathname) {
      prevPathnameRef.current = pathname;
      onClose();
    }
  }, [pathname, onClose]);

  // Manejo de tecla Escape
  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape' && isOpen) {
        onClose();
      }
    };
    if (isOpen) {
      window.addEventListener('keydown', handleKeyDown);
    }
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, onClose]);

  const isActive = (href: string) => {
    if (href === '/') return pathname === '/';
    return pathname.startsWith(href);
  };

  // Ítems de la barra inferior flotante (Inicio, Catálogo, Reseñar, Mis Reseñas)
  const BOTTOM_ITEMS = NAV_ITEMS.filter((item) => !item.adminOnly);
  const DRAWER_ITEMS = NAV_ITEMS.filter((item) => !item.adminOnly || isAdmin);

  return (
    <>
      {/* 1. Barra de navegación inferior flotante con botón central '+' distinguible */}
      <nav
        aria-label="Navegación inferior móvil"
        className="lg:hidden fixed bottom-3 inset-x-3 z-40 max-w-lg mx-auto pb-[env(safe-area-inset-bottom,0px)]"
      >
        <div className="glass-panel rounded-2xl py-1.5 px-3 border border-frost-steel dark:border-steam-steel/50 shadow-2xl flex items-center justify-around gap-1">
          {BOTTOM_ITEMS.map((item) => {
            const active = isActive(item.href);
            const isPublishAction = item.href === '/resenas/nueva';

            if (isPublishAction) {
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  aria-current={active ? 'page' : undefined}
                  className="relative -top-3 flex flex-col items-center group focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-sky-accent dark:focus-visible:ring-steam-blue rounded-2xl"
                  aria-label="Publicar nueva reseña"
                >
                  <div
                    className={`w-12 h-12 rounded-2xl flex items-center justify-center transition-all duration-200 group-hover:scale-105 active:scale-95 shadow-lg ${
                      active
                        ? 'bg-deep-navy dark:bg-steam-blue text-white dark:text-steam-dark ring-2 ring-sky-accent dark:ring-steam-blue shadow-sky-accent/30 dark:shadow-[0_0_20px_rgba(102,192,244,0.6)]'
                        : 'bg-deep-navy dark:bg-steam-blue text-white dark:text-steam-dark shadow-deep-navy/30 dark:shadow-[0_0_15px_rgba(102,192,244,0.4)] border border-sky-accent/50 dark:border-steam-blue'
                    }`}
                  >
                    <Plus className="w-6 h-6 stroke-[3]" aria-hidden="true" />
                  </div>
                  <span
                    className={`text-[10px] tracking-tight font-mono font-bold mt-0.5 ${
                      active
                        ? 'text-sky-accent dark:text-steam-blue'
                        : 'text-charcoal-text dark:text-pure-white'
                    }`}
                  >
                    Reseñar
                  </span>
                </Link>
              );
            }

            const Icon = item.icon;

            return (
              <Link
                key={item.href}
                href={item.href}
                aria-current={active ? 'page' : undefined}
                className={`flex flex-col items-center justify-center py-2 px-2.5 rounded-xl transition-all duration-200 min-w-[64px] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-sky-accent dark:focus-visible:ring-steam-blue ${
                  active
                    ? 'text-sky-accent dark:text-steam-blue font-bold scale-105 bg-frost-steel/40 dark:bg-steam-steel/40 shadow-inner'
                    : 'text-active-slate/80 dark:text-steam-light/80 hover:text-charcoal-text dark:hover:text-pure-white'
                }`}
              >
                <Icon className="w-5 h-5 mb-0.5" aria-hidden="true" />
                <span className="text-[10px] tracking-tight font-medium">{item.label}</span>
              </Link>
            );
          })}
        </div>
      </nav>

      {/* 2. Menú Drawer desplegable al pulsar hamburguesa */}
      {isOpen && (
        <div
          role="dialog"
          aria-modal="true"
          aria-label="Menú de navegación móvil"
          className="lg:hidden fixed inset-0 z-50 flex flex-col justify-end sm:justify-start"
        >
          {/* Backdrop con desenfoque */}
          <div
            onClick={onClose}
            aria-hidden="true"
            className="fixed inset-0 bg-black/60 backdrop-blur-sm transition-opacity"
          />

          {/* Panel del Drawer */}
          <div className="relative w-full sm:max-w-xs h-auto sm:h-full glass-panel border-t sm:border-r sm:border-t-0 border-frost-steel dark:border-steam-steel/50 p-6 flex flex-col justify-between shadow-2xl z-10 animate-in slide-in-from-bottom sm:slide-in-from-left duration-200 overscroll-contain">
            <div>
              {/* Encabezado del Drawer */}
              <div className="flex items-center justify-between pb-4 border-b border-frost-steel dark:border-steam-steel/30">
                <div className="flex items-center gap-2.5">
                  <div className="w-9 h-9 rounded-xl bg-steam-blue/20 border border-steam-blue/40 flex items-center justify-center text-sky-accent dark:text-steam-blue shadow-[0_0_12px_rgba(102,192,244,0.3)]">
                    <Gauge className="w-5 h-5" aria-hidden="true" />
                  </div>
                  <span className="font-extrabold text-lg text-charcoal-text dark:text-pure-white font-mono">
                    GAUGE
                  </span>
                </div>
                <button
                  type="button"
                  onClick={onClose}
                  aria-label="Cerrar menú de navegación"
                  className="min-w-[42px] min-h-[42px] p-2 rounded-xl text-active-slate dark:text-steam-light hover:text-charcoal-text dark:hover:text-pure-white hover:bg-frost-bg dark:hover:bg-steam-steel/40 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-sky-accent dark:focus-visible:ring-steam-blue flex items-center justify-center"
                >
                  <X className="w-5 h-5" aria-hidden="true" />
                </button>
              </div>

              {/* Enlaces de Navegación del Drawer */}
              <nav className="flex flex-col gap-2 mt-6" aria-label="Menú extendido">
                {DRAWER_ITEMS.map((item) => {
                  const active = isActive(item.href);
                  const Icon = item.icon;

                  return (
                    <Link
                      key={item.href}
                      href={item.href}
                      onClick={onClose}
                      aria-current={active ? 'page' : undefined}
                      className={`flex items-center gap-3.5 px-4 py-3 rounded-2xl text-sm font-semibold transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-sky-accent dark:focus-visible:ring-steam-blue ${
                        active
                          ? 'bg-deep-navy text-white dark:bg-steam-blue dark:text-steam-dark shadow-[0_0_16px_rgba(102,192,244,0.3)] font-bold'
                          : 'text-active-slate dark:text-steam-light hover:bg-frost-bg dark:hover:bg-steam-steel/30 hover:text-charcoal-text dark:hover:text-pure-white'
                      }`}
                    >
                      <Icon className="w-5 h-5 shrink-0" aria-hidden="true" />
                      <span>{item.label}</span>
                    </Link>
                  );
                })}
              </nav>
            </div>

            {/* Pie del Drawer: Sesión y Cambio de Tema */}
            <div className="pt-6 border-t border-frost-steel dark:border-steam-steel/30 flex flex-col gap-3">
              <div className="flex items-center justify-between">
                <span className="text-xs text-active-slate/80 dark:text-steam-light/70 font-medium">
                  Tema visual
                </span>
                <ThemeToggle />
              </div>

              <Link
                href="/login"
                onClick={onClose}
                className="w-full flex items-center justify-center gap-2 min-h-[44px] py-2.5 px-4 rounded-xl text-sm font-bold bg-white dark:bg-steam-steel/40 text-charcoal-text dark:text-steam-light hover:bg-frost-bg dark:hover:bg-steam-steel/70 hover:text-deep-navy dark:hover:text-pure-white border border-frost-steel dark:border-steam-steel/50 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-sky-accent dark:focus-visible:ring-steam-blue transition-colors shadow-sm"
              >
                <UserIcon className="w-4 h-4 text-sky-accent dark:text-steam-blue" aria-hidden="true" />
                <span>Iniciar Sesión</span>
              </Link>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
