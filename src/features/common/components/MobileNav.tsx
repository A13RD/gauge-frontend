'use client';

import React, { useEffect } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import {
  Gamepad2,
  Compass,
  Star,
  Shield,
  X,
  Gauge,
  User as UserIcon,
} from 'lucide-react';
import { ThemeToggle } from './ThemeToggle';
import { NAV_ITEMS } from './Sidebar';

interface MobileNavProps {
  isOpen: boolean;
  onClose: () => void;
}

export function MobileNav({ isOpen, onClose }: MobileNavProps) {
  const pathname = usePathname();

  // Cerrar el drawer al cambiar de ruta
  useEffect(() => {
    onClose();
  }, [pathname, onClose]);

  // Manejo de tecla Escape
  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape' && isOpen) {
        onClose();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, onClose]);

  const isActive = (href: string) => {
    if (href === '/') return pathname === '/';
    return pathname.startsWith(href);
  };

  // Ítems de la barra inferior flotante (Inicio, Catálogo, Mis Reseñas)
  const BOTTOM_ITEMS = NAV_ITEMS.filter((item) => !item.adminOnly);

  return (
    <>
      {/* 1. Barra de navegación inferior flotante (Mobile & Tablet < lg) */}
      <nav
        aria-label="Navegación inferior móvil"
        className="lg:hidden fixed bottom-3 inset-x-4 z-40 max-w-md mx-auto"
      >
        <div className="glass-panel rounded-2xl py-2 px-3 border border-steam-steel/50 dark:border-steam-steel/50 light:border-frost-steel shadow-2xl flex items-center justify-around gap-1">
          {BOTTOM_ITEMS.map((item) => {
            const active = isActive(item.href);
            const Icon = item.icon;

            return (
              <Link
                key={item.href}
                href={item.href}
                aria-current={active ? 'page' : undefined}
                className={`flex flex-col items-center justify-center py-1.5 px-3 rounded-xl transition-all duration-200 min-w-[72px] focus:outline-none focus:ring-2 focus:ring-steam-blue ${
                  active
                    ? 'text-steam-blue light:text-sky-accent font-bold scale-105 bg-steam-steel/30 dark:bg-steam-steel/30 light:bg-frost-bg/90'
                    : 'text-steam-light/80 light:text-active-slate/80 hover:text-white light:hover:text-charcoal-text'
                }`}
              >
                <Icon className="w-5 h-5 mb-0.5" />
                <span className="text-[10px] tracking-tight">{item.label}</span>
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
          <div className="relative w-full sm:max-w-xs h-auto sm:h-full glass-panel border-t sm:border-r sm:border-t-0 border-steam-steel/50 dark:border-steam-steel/50 light:border-frost-steel p-6 flex flex-col justify-between shadow-2xl z-10 animate-in slide-in-from-bottom sm:slide-in-from-left duration-200">
            <div>
              {/* Encabezado del Drawer */}
              <div className="flex items-center justify-between pb-4 border-b border-steam-steel/30 dark:border-steam-steel/30 light:border-frost-steel">
                <div className="flex items-center gap-2.5">
                  <div className="w-9 h-9 rounded-xl bg-steam-blue/20 border border-steam-blue/40 flex items-center justify-center text-steam-blue shadow-[0_0_12px_rgba(102,192,244,0.3)]">
                    <Gauge className="w-5 h-5" />
                  </div>
                  <span className="font-extrabold text-lg text-white light:text-charcoal-text font-mono">
                    GAUGE
                  </span>
                </div>
                <button
                  type="button"
                  onClick={onClose}
                  aria-label="Cerrar menú de navegación"
                  className="p-2 rounded-xl text-steam-light light:text-active-slate hover:text-white hover:bg-steam-steel/40 focus:outline-none focus:ring-2 focus:ring-steam-blue"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              {/* Enlaces de Navegación del Drawer */}
              <nav className="flex flex-col gap-2 mt-6" aria-label="Menú extendido">
                {NAV_ITEMS.map((item) => {
                  const active = isActive(item.href);
                  const Icon = item.icon;

                  return (
                    <Link
                      key={item.href}
                      href={item.href}
                      onClick={onClose}
                      aria-current={active ? 'page' : undefined}
                      className={`flex items-center gap-3.5 px-4 py-3 rounded-2xl text-sm font-semibold transition-all focus:outline-none focus:ring-2 focus:ring-steam-blue ${
                        active
                          ? 'bg-steam-blue text-steam-dark shadow-[0_0_16px_rgba(102,192,244,0.3)] light:bg-deep-navy light:text-white'
                          : 'text-steam-light light:text-active-slate hover:bg-steam-steel/30 dark:hover:bg-steam-steel/30 light:hover:bg-frost-bg hover:text-white light:hover:text-charcoal-text'
                      }`}
                    >
                      <Icon className="w-5 h-5 shrink-0" />
                      <span>{item.label}</span>
                    </Link>
                  );
                })}
              </nav>
            </div>

            {/* Pie del Drawer: Sesión y Cambio de Tema */}
            <div className="pt-6 border-t border-steam-steel/30 dark:border-steam-steel/30 light:border-frost-steel flex flex-col gap-3">
              <div className="flex items-center justify-between">
                <span className="text-xs text-steam-light/70 light:text-active-slate/70">
                  Tema visual
                </span>
                <ThemeToggle />
              </div>

              <Link
                href="/login"
                onClick={onClose}
                className="w-full flex items-center justify-center gap-2 py-2.5 px-4 rounded-xl text-sm font-bold bg-steam-steel/30 dark:bg-steam-steel/30 light:bg-frost-bg text-steam-light light:text-active-slate hover:text-white light:hover:text-charcoal-text border border-steam-steel/50 dark:border-steam-steel/50 light:border-frost-steel focus:outline-none focus:ring-2 focus:ring-steam-blue transition-colors"
              >
                <UserIcon className="w-4 h-4 text-steam-blue light:text-sky-accent" />
                <span>Iniciar Sesión</span>
              </Link>
            </div>
          </div>
        </div>
      )}
    </>
  );
}

