'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import {
  Gamepad2,
  Compass,
  Star,
  Shield,
  ChevronLeft,
  ChevronRight,
  Gauge as GaugeIcon,
} from 'lucide-react';

export interface NavItem {
  label: string;
  href: string;
  icon: React.ComponentType<{ className?: string }>;
  adminOnly?: boolean;
}

export const NAV_ITEMS: NavItem[] = [
  { label: 'Inicio', href: '/', icon: Gamepad2 },
  { label: 'Catálogo', href: '/catalogo', icon: Compass },
  { label: 'Mis reseñas', href: '/mis-reseñas', icon: Star },
  { label: 'Administración', href: '/admin', icon: Shield, adminOnly: true },
];

interface SidebarProps {
  className?: string;
  isExpanded?: boolean;
  onToggleExpanded?: () => void;
}

export function Sidebar({
  className = '',
  isExpanded: controlledExpanded,
  onToggleExpanded,
}: SidebarProps) {
  const [internalExpanded, setInternalExpanded] = useState(false);
  const pathname = usePathname();

  const isExpanded =
    controlledExpanded !== undefined ? controlledExpanded : internalExpanded;

  const handleToggle = () => {
    if (onToggleExpanded) {
      onToggleExpanded();
    } else {
      setInternalExpanded((prev) => !prev);
    }
  };

  const isActive = (href: string) => {
    if (href === '/') return pathname === '/';
    return pathname.startsWith(href);
  };

  return (
    <aside
      aria-label="Navegación principal de escritorio"
      className={`hidden lg:flex flex-col z-30 transition-all duration-300 ease-in-out shrink-0 ${
        isExpanded ? 'w-60' : 'w-20'
      } ${className}`}
    >
      <div
        className={`glass-panel h-full flex flex-col justify-between py-6 px-3 rounded-3xl border border-steam-steel/40 dark:border-steam-steel/40 light:border-frost-steel shadow-2xl transition-all duration-300 relative overflow-hidden`}
      >
        {/* Encabezado con Logo GAUGE interactivo */}
        <div className="flex flex-col items-center">
          <button
            type="button"
            onClick={handleToggle}
            aria-expanded={isExpanded}
            aria-label={
              isExpanded
                ? 'Colapsar barra lateral'
                : 'Expandir barra lateral'
            }
            className={`w-full flex items-center gap-3 p-2.5 rounded-2xl transition-all duration-200 group hover:bg-steam-steel/30 dark:hover:bg-steam-steel/30 light:hover:bg-frost-bg focus:outline-none focus:ring-2 focus:ring-steam-blue ${
              isExpanded ? 'justify-between px-3' : 'justify-center'
            }`}
          >
            <div className="flex items-center gap-3 min-w-0">
              <div className="w-10 h-10 rounded-xl bg-steam-blue/20 border border-steam-blue/40 flex items-center justify-center text-steam-blue shrink-0 group-hover:scale-105 transition-transform shadow-[0_0_12px_rgba(102,192,244,0.3)]">
                <GaugeIcon className="w-6 h-6" />
              </div>
              {isExpanded && (
                <div className="flex flex-col text-left overflow-hidden">
                  <span className="font-extrabold tracking-wider text-base text-white light:text-charcoal-text font-mono">
                    GAUGE
                  </span>
                  <span className="text-[10px] text-steam-light/70 light:text-active-slate/70 tracking-tight truncate">
                    Arcade Matrix
                  </span>
                </div>
              )}
            </div>

            {isExpanded ? (
              <ChevronLeft className="w-4 h-4 text-steam-light/60 light:text-active-slate/60 group-hover:text-steam-blue transition-colors shrink-0" />
            ) : null}
          </button>

          {/* Divisor sutil */}
          <div className="w-full my-4 h-px bg-steam-steel/40 dark:bg-steam-steel/40 light:bg-frost-steel/60" />

          {/* Lista de enlaces de navegación */}
          <nav className="w-full flex flex-col gap-2" aria-label="Enlaces del sidebar">
            {NAV_ITEMS.map((item) => {
              const active = isActive(item.href);
              const Icon = item.icon;

              return (
                <Link
                  key={item.href}
                  href={item.href}
                  aria-current={active ? 'page' : undefined}
                  title={!isExpanded ? item.label : undefined}
                  className={`group relative flex items-center gap-3.5 px-3 py-3 rounded-2xl font-medium text-sm transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-steam-blue ${
                    active
                      ? 'concave-active text-steam-blue font-bold shadow-[0_0_16px_rgba(102,192,244,0.2)]'
                      : 'text-steam-light light:text-active-slate hover:text-white light:hover:text-charcoal-text hover:bg-steam-steel/25 dark:hover:bg-steam-steel/25 light:hover:bg-frost-steel/30'
                  } ${isExpanded ? 'justify-start' : 'justify-center'}`}
                >
                  <Icon
                    className={`w-5 h-5 shrink-0 transition-transform duration-200 group-hover:scale-110 ${
                      active
                        ? 'text-steam-blue light:text-sky-accent'
                        : 'text-steam-light/80 light:text-active-slate/80'
                    }`}
                  />
                  {isExpanded && (
                    <span className="truncate transition-opacity duration-200">
                      {item.label}
                    </span>
                  )}

                  {/* Indicador luminoso lateral en estado activo */}
                  {active && !isExpanded && (
                    <span
                      aria-hidden="true"
                      className="absolute right-1 w-1.5 h-6 rounded-full bg-steam-blue light:bg-sky-accent shadow-[0_0_8px_rgba(102,192,244,0.8)]"
                    />
                  )}
                </Link>
              );
            })}
          </nav>
        </div>

        {/* Pie de sidebar con botón expansor rápido si está colapsado */}
        {!isExpanded && (
          <div className="w-full flex justify-center pt-4 border-t border-steam-steel/30 dark:border-steam-steel/30 light:border-frost-steel/40">
            <button
              type="button"
              onClick={handleToggle}
              aria-label="Expandir barra lateral"
              className="p-2 rounded-xl text-steam-light/60 light:text-active-slate/60 hover:text-steam-blue hover:bg-steam-steel/30 transition-all focus:outline-none focus:ring-2 focus:ring-steam-blue"
            >
              <ChevronRight className="w-4 h-4" />
            </button>
          </div>
        )}
      </div>
    </aside>
  );
}

