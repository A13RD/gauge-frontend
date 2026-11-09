import React from 'react';
import Link from 'next/link';
import {
  User as UserIcon,
  BarChart3,
  Clock,
  Sparkles,
  SquarePen,
  Compass,
} from 'lucide-react';
import { Button } from './Button';

export interface RightDockProps {
  children?: React.ReactNode;
  title?: string;
  className?: string;
}

export function RightDock({
  children,
  title = 'Centro de Control',
  className = '',
}: RightDockProps) {
  return (
    <aside
      aria-label="Panel lateral complementario"
      className={`hidden xl:flex flex-col w-80 shrink-0 z-20 ${className}`}
    >
      <div className="glass-panel h-full flex flex-col p-5 rounded-3xl border border-frost-steel dark:border-steam-steel/40 shadow-2xl transition-all gap-5 overflow-y-auto">
        {/* Encabezado del Dock */}
        <div className="flex items-center justify-between pb-3 border-b border-frost-steel dark:border-steam-steel/30">
          <div className="flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-sky-accent dark:bg-steam-blue animate-pulse shadow-[0_0_8px_rgba(102,192,244,0.8)]" />
            <h2 className="text-xs font-bold uppercase tracking-wider text-charcoal-text dark:text-pure-white font-mono">
              {title}
            </h2>
          </div>
          <span className="text-[10px] font-mono font-medium text-active-slate/70 dark:text-steam-light/60 uppercase">
            GAUGE v1.0
          </span>
        </div>

        {/* Contenido inyectado o Widgets oficiales del Dashboard */}
        {children || (
          <div className="flex flex-col gap-5">
            {/* 1. Widget de Perfil / Estado de Sesión */}
            <div className="p-4 rounded-2xl bg-white dark:bg-steam-navy/80 border border-frost-steel dark:border-steam-steel/50 shadow-sm flex flex-col gap-3">
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 rounded-2xl bg-frost-bg dark:bg-steam-steel/40 border border-frost-steel dark:border-steam-steel/60 flex items-center justify-center text-sky-accent dark:text-steam-blue shadow-inner shrink-0">
                  <UserIcon className="w-6 h-6" aria-hidden="true" />
                </div>
                <div className="min-w-0 flex-1">
                  <h3 className="text-sm font-bold text-charcoal-text dark:text-pure-white truncate">
                    Jugador Invitado
                  </h3>
                  <span className="inline-flex items-center gap-1.5 text-[11px] font-medium text-active-slate/80 dark:text-steam-light/80">
                    <span className="w-1.5 h-1.5 rounded-full bg-emerald-500" />
                    Modo Espectador
                  </span>
                </div>
              </div>
              <Link href="/login" className="w-full">
                <Button variant="outline" size="sm" className="w-full text-xs">
                  Iniciar Sesión
                </Button>
              </Link>
            </div>

            {/* 2. Widget "Your Statistics" (Métricas & Anillo Visual) */}
            <div className="p-4 rounded-2xl bg-white dark:bg-steam-navy/80 border border-frost-steel dark:border-steam-steel/50 shadow-sm flex flex-col gap-3">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <BarChart3 className="w-4 h-4 text-sky-accent dark:text-steam-blue" aria-hidden="true" />
                  <h4 className="text-xs font-bold uppercase tracking-wider text-charcoal-text dark:text-pure-white font-mono">
                    Tus Estadísticas
                  </h4>
                </div>
                <span className="text-[10px] text-active-slate/60 dark:text-steam-light/50 font-mono">
                  Personal
                </span>
              </div>

              {/* Gráfica circular SVG estilizada estilo PS5 / Recharts */}
              <div className="flex items-center justify-center py-2 relative">
                <svg className="w-28 h-28 transform -rotate-90" viewBox="0 0 100 100" aria-hidden="true">
                  {/* Pista de fondo */}
                  <circle
                    cx="50"
                    cy="50"
                    r="40"
                    stroke="currentColor"
                    strokeWidth="10"
                    className="text-frost-steel/40 dark:text-steam-steel/40"
                    fill="transparent"
                  />
                  {/* Segmento Survival Horror / Acción */}
                  <circle
                    cx="50"
                    cy="50"
                    r="40"
                    stroke="currentColor"
                    strokeWidth="10"
                    strokeDasharray="251.2"
                    strokeDashoffset="100"
                    strokeLinecap="round"
                    className="text-sky-accent dark:text-steam-blue transition-all duration-1000"
                    fill="transparent"
                  />
                </svg>
                <div className="absolute inset-0 flex flex-col items-center justify-center text-center">
                  <span className="text-lg font-black font-mono text-charcoal-text dark:text-pure-white">
                    0h
                  </span>
                  <span className="text-[9px] uppercase tracking-wider text-active-slate/70 dark:text-steam-light/60 font-semibold">
                    Registradas
                  </span>
                </div>
              </div>

              {/* Barras de distribución por género */}
              <div className="flex flex-col gap-2 pt-1 border-t border-frost-steel/60 dark:border-steam-steel/30 text-xs">
                <div className="space-y-1">
                  <div className="flex justify-between text-[11px] text-active-slate dark:text-steam-light">
                    <span>Survival Horror</span>
                    <span className="font-mono text-charcoal-text dark:text-pure-white">-- %</span>
                  </div>
                  <div className="h-1.5 w-full bg-frost-steel/40 dark:bg-steam-steel/40 rounded-full overflow-hidden">
                    <div className="h-full bg-sky-accent dark:bg-steam-blue rounded-full w-0" />
                  </div>
                </div>

                <div className="space-y-1">
                  <div className="flex justify-between text-[11px] text-active-slate dark:text-steam-light">
                    <span>Acción / FPS</span>
                    <span className="font-mono text-charcoal-text dark:text-pure-white">-- %</span>
                  </div>
                  <div className="h-1.5 w-full bg-frost-steel/40 dark:bg-steam-steel/40 rounded-full overflow-hidden">
                    <div className="h-full bg-emerald-500 rounded-full w-0" />
                  </div>
                </div>
              </div>

              <p className="text-[11px] text-active-slate/70 dark:text-steam-light/70 leading-relaxed text-center pt-2">
                Conecta tu cuenta para sincronizar tus horas de gameplay y desbloquear tu gráfico analítico.
              </p>
            </div>

            {/* 3. Accesos Rápidos */}
            <div className="p-4 rounded-2xl bg-white dark:bg-steam-navy/80 border border-frost-steel dark:border-steam-steel/50 shadow-sm flex flex-col gap-2">
              <span className="text-[11px] font-bold uppercase tracking-wider text-active-slate/80 dark:text-steam-light/70 font-mono mb-1">
                Accesos Directos
              </span>
              <Link href="/resenas/nueva">
                <Button
                  variant="primary"
                  size="sm"
                  className="w-full justify-start text-xs"
                  leftIcon={<SquarePen className="w-4 h-4" />}
                >
                  Publicar Reseña
                </Button>
              </Link>
              <Link href="/catalogo">
                <Button
                  variant="secondary"
                  size="sm"
                  className="w-full justify-start text-xs"
                  leftIcon={<Compass className="w-4 h-4" />}
                >
                  Explorar Catálogo
                </Button>
              </Link>
            </div>
          </div>
        )}
      </div>
    </aside>
  );
}
