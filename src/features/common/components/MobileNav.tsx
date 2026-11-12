'use client';

import React, { useEffect, useRef } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import {
  Plus,
  X,
  User as UserIcon,
  LogOut,
  ShieldCheck,
} from 'lucide-react';
import { ThemeToggle } from './ThemeToggle';
import { BrandLogo } from './BrandLogo';
import { NAV_ITEMS } from './Sidebar';
import { useAuth } from '@/features/auth';

interface MobileNavProps {
  isOpen: boolean;
  onClose: () => void;
  isAdmin?: boolean;
}

export function MobileNav({ isOpen, onClose, isAdmin = false }: MobileNavProps) {
  const pathname = usePathname();
  const prevPathnameRef = useRef(pathname);
  const { user, isAuthenticated, logout } = useAuth();

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
        className="lg:hidden fixed bottom-2.5 inset-x-2.5 sm:inset-x-4 z-40 max-w-lg mx-auto pb-[env(safe-area-inset-bottom,0px)]"
      >
        <div className="glass-panel rounded-2xl py-1.5 px-2 sm:px-3 border border-frost-steel dark:border-steam-steel/50 shadow-2xl flex items-center justify-around gap-1">
          {BOTTOM_ITEMS.map((item) => {
            const active = isActive(item.href);
            const isPublishAction = item.href === '/resenas/nueva';

            if (isPublishAction) {
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  aria-current={active ? 'page' : undefined}
                  className="relative -top-2.5 flex-1 min-w-0 flex flex-col items-center group focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-sky-accent dark:focus-visible:ring-steam-blue rounded-2xl"
                  aria-label="Publicar nueva reseña"
                >
                  <div
                    className={`w-11 h-11 sm:w-12 sm:h-12 rounded-2xl flex items-center justify-center transition-all duration-200 group-hover:scale-105 active:scale-95 shadow-lg ${
                      active
                        ? 'bg-deep-navy dark:bg-steam-blue text-white dark:text-steam-dark ring-2 ring-sky-accent dark:ring-steam-blue shadow-sky-accent/30 dark:shadow-[0_0_20px_rgba(102,192,244,0.6)]'
                        : 'bg-deep-navy dark:bg-steam-blue text-white dark:text-steam-dark shadow-deep-navy/30 dark:shadow-[0_0_15px_rgba(102,192,244,0.4)] border border-sky-accent/50 dark:border-steam-blue'
                    }`}
                  >
                    <Plus className="w-5 h-5 sm:w-6 sm:h-6 stroke-[3]" aria-hidden="true" />
                  </div>
                  <span
                    className={`text-[10px] tracking-tight font-mono font-bold mt-0.5 truncate max-w-full ${
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
                className={`flex-1 min-w-0 flex flex-col items-center justify-center py-2 px-1.5 sm:px-2.5 rounded-xl transition-all duration-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-sky-accent dark:focus-visible:ring-steam-blue ${
                  active
                    ? 'text-sky-accent dark:text-steam-blue font-bold bg-frost-steel/40 dark:bg-steam-steel/40 shadow-inner'
                    : 'text-active-slate/80 dark:text-steam-light/80 hover:text-charcoal-text dark:hover:text-pure-white'
                }`}
              >
                <Icon className="w-5 h-5 mb-0.5 shrink-0" aria-hidden="true" />
                <span className="text-[10px] tracking-tight font-medium truncate max-w-full">
                  {item.label}
                </span>
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

          {/* Panel del Drawer con scroll vertical seguro en pantallas pequeñas */}
          <div className="relative w-full sm:max-w-xs h-auto max-h-[85dvh] sm:max-h-full sm:h-full overflow-y-auto glass-panel border-t sm:border-r sm:border-t-0 border-frost-steel dark:border-steam-steel/50 rounded-t-3xl sm:rounded-none p-5 sm:p-6 flex flex-col justify-between gap-6 shadow-2xl z-10 animate-in slide-in-from-bottom sm:slide-in-from-left duration-200 overscroll-contain">
            <div>
              {/* Encabezado del Drawer */}
              <div className="flex items-center justify-between pb-4 border-b border-frost-steel dark:border-steam-steel/30">
                <BrandLogo size="sm" interactive={false} />
                <button
                  type="button"
                  onClick={onClose}
                  aria-label="Cerrar menú de navegación"
                  className="min-w-[40px] min-h-[40px] p-2 rounded-xl text-active-slate dark:text-steam-light hover:text-charcoal-text dark:hover:text-pure-white hover:bg-frost-bg dark:hover:bg-steam-steel/40 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-sky-accent dark:focus-visible:ring-steam-blue flex items-center justify-center"
                >
                  <X className="w-5 h-5" aria-hidden="true" />
                </button>
              </div>

              {/* Enlaces de Navegación del Drawer */}
              <nav className="flex flex-col gap-2 mt-5" aria-label="Menú extendido">
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
                      <span className="truncate">{item.label}</span>
                    </Link>
                  );
                })}
              </nav>
            </div>

            {/* Pie del Drawer: Sesión Real y Cambio de Tema */}
            <div className="pt-5 border-t border-frost-steel dark:border-steam-steel/30 flex flex-col gap-3">
              <div className="flex items-center justify-between">
                <span className="text-xs text-active-slate/80 dark:text-steam-light/70 font-medium">
                  Tema visual
                </span>
                <ThemeToggle />
              </div>

              {isAuthenticated && user ? (
                <div className="flex flex-col gap-2.5">
                  <div className="flex items-center justify-between gap-2 p-2.5 rounded-xl bg-white dark:bg-steam-steel/30 border border-frost-steel dark:border-steam-steel/50">
                    <div className="flex items-center gap-2.5 min-w-0">
                      <div className="w-8 h-8 rounded-lg bg-sky-accent/20 dark:bg-steam-blue/20 flex items-center justify-center font-mono font-bold text-xs text-sky-accent dark:text-steam-blue shrink-0">
                        {user.name.substring(0, 2).toUpperCase()}
                      </div>
                      <div className="min-w-0">
                        <p className="text-xs font-bold text-charcoal-text dark:text-pure-white truncate">
                          {user.name}
                        </p>
                        <p className="text-[10px] font-mono text-active-slate/70 dark:text-steam-light/60 truncate">
                          {user.email}
                        </p>
                      </div>
                    </div>
                    {isAdmin && (
                      <span className="inline-flex items-center gap-0.5 px-1.5 py-0.5 rounded text-[10px] font-mono font-bold bg-amber-500/20 text-amber-600 dark:text-amber-400 shrink-0">
                        <ShieldCheck className="w-3 h-3" />
                        ADMIN
                      </span>
                    )}
                  </div>

                  <button
                    type="button"
                    onClick={() => {
                      logout();
                      onClose();
                    }}
                    className="w-full flex items-center justify-center gap-2 min-h-[42px] py-2.5 px-4 rounded-xl text-xs font-bold bg-rose-500/10 text-rose-600 dark:text-rose-400 hover:bg-rose-500/20 border border-rose-500/30 transition-colors cursor-pointer"
                  >
                    <LogOut className="w-4 h-4" aria-hidden="true" />
                    <span>Cerrar Sesión</span>
                  </button>
                </div>
              ) : (
                <Link
                  href="/login"
                  onClick={onClose}
                  className="w-full flex items-center justify-center gap-2 min-h-[44px] py-2.5 px-4 rounded-xl text-sm font-bold bg-white dark:bg-steam-steel/40 text-charcoal-text dark:text-steam-light hover:bg-frost-bg dark:hover:bg-steam-steel/70 hover:text-deep-navy dark:hover:text-pure-white border border-frost-steel dark:border-steam-steel/50 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-sky-accent dark:focus-visible:ring-steam-blue transition-colors shadow-sm"
                >
                  <UserIcon className="w-4 h-4 text-sky-accent dark:text-steam-blue" aria-hidden="true" />
                  <span>Iniciar Sesión</span>
                </Link>
              )}
            </div>
          </div>
        </div>
      )}
    </>
  );
}
