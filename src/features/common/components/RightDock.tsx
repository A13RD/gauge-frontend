import React from 'react';
import Link from 'next/link';
import {
  User as UserIcon,
  BarChart3,
  LogOut,
  ShieldCheck,
  UserPlus,
} from 'lucide-react';
import { Button } from './Button';
import { useAuth } from '@/features/auth';
import { useUserStats } from '@/features/users';

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
  const { user, isAuthenticated, isAdmin, logout } = useAuth();
  const { stats, isLoading: isLoadingStats } = useUserStats();

  const totalHours = stats?.totalHours ?? 0;
  const totalReviews = stats?.totalReviews ?? 0;
  const topGenres = stats?.hoursByGenre ? stats.hoursByGenre.slice(0, 3) : [];
  const strokeOffset = Math.max(0, 251.2 - Math.min(1, totalHours / 100) * 251.2);
  return (
    <aside
      aria-label="Panel lateral complementario"
      className={`hidden xl:flex flex-col w-80 shrink-0 z-20 self-start xl:sticky xl:top-6 ${className}`}
    >
      <div className="glass-panel flex flex-col p-5 rounded-3xl border border-frost-steel dark:border-steam-steel/40 shadow-2xl transition-all gap-5 overflow-hidden">
        {/* Encabezado del Dock */}
        <div className="flex items-center justify-between pb-3 border-b border-frost-steel dark:border-steam-steel/30 shrink-0">
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
            <div className="p-4 rounded-2xl bg-white dark:bg-steam-navy/80 border border-frost-steel dark:border-steam-steel/50 shadow-sm flex flex-col gap-3 shrink-0">
              {isAuthenticated && user ? (
                <>
                  <div className="flex items-center gap-3">
                    <div className="w-12 h-12 rounded-2xl bg-sky-accent/20 dark:bg-steam-blue/20 border border-sky-accent/40 dark:border-steam-blue/40 flex items-center justify-center font-mono font-black text-sm text-sky-accent dark:text-steam-blue shadow-inner shrink-0">
                      {user.name.substring(0, 2).toUpperCase()}
                    </div>
                    <div className="min-w-0 flex-1">
                      <h3 className="text-sm font-bold text-charcoal-text dark:text-pure-white truncate">
                        {user.name}
                      </h3>
                      <span className="inline-flex items-center gap-1.5 text-[11px] font-medium text-active-slate/80 dark:text-steam-light/80 truncate">
                        <span className={`w-1.5 h-1.5 rounded-full ${isAdmin ? 'bg-amber-500' : 'bg-emerald-500'}`} />
                        {isAdmin ? 'Administrador' : 'Jugador Verificado'}
                      </span>
                    </div>
                  </div>

                  <div className="flex flex-col gap-2 pt-1 border-t border-frost-steel/60 dark:border-steam-steel/30">
                    {isAdmin && (
                      <Link href="/admin" className="w-full">
                        <Button
                          variant="secondary"
                          size="sm"
                          className="w-full text-xs"
                          leftIcon={<ShieldCheck className="w-3.5 h-3.5" />}
                        >
                          Panel Administrativo
                        </Button>
                      </Link>
                    )}
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={logout}
                      className="w-full text-xs text-rose-500 dark:text-rose-400 hover:border-rose-500"
                      leftIcon={<LogOut className="w-3.5 h-3.5" />}
                    >
                      Cerrar Sesión
                    </Button>
                  </div>
                </>
              ) : (
                <>
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

                  <div className="flex items-center gap-2 pt-1">
                    <Link href="/login" className="flex-1">
                      <Button variant="primary" size="sm" className="w-full text-xs">
                        Iniciar Sesión
                      </Button>
                    </Link>
                    <Link href="/register" className="flex-1">
                      <Button variant="secondary" size="sm" className="w-full text-xs" leftIcon={<UserPlus className="w-3 h-3" />}>
                        Registro
                      </Button>
                    </Link>
                  </div>
                </>
              )}
            </div>

            {/* 2. Widget "Your Statistics" (Métricas & Anillo Visual) */}
            <div className="p-4 rounded-2xl bg-white dark:bg-steam-navy/80 border border-frost-steel dark:border-steam-steel/50 shadow-sm flex flex-col gap-3 shrink-0">
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
                  {/* Segmento dinámico de horas */}
                  <circle
                    cx="50"
                    cy="50"
                    r="40"
                    stroke="currentColor"
                    strokeWidth="10"
                    strokeDasharray="251.2"
                    strokeDashoffset={strokeOffset}
                    strokeLinecap="round"
                    className="text-sky-accent dark:text-steam-blue transition-all duration-1000"
                    fill="transparent"
                  />
                </svg>
                <div className="absolute inset-0 flex flex-col items-center justify-center text-center">
                  <span className="text-lg font-black font-mono text-charcoal-text dark:text-pure-white">
                    {isLoadingStats ? '...' : `${totalHours}h`}
                  </span>
                  <span className="text-[9px] uppercase tracking-wider text-active-slate/70 dark:text-steam-light/60 font-semibold">
                    {isAuthenticated ? `${totalReviews} Reseñas` : 'Registradas'}
                  </span>
                </div>
              </div>

              {/* Barras dinámicas de distribución por género */}
              {isAuthenticated && topGenres.length > 0 ? (
                <div className="flex flex-col gap-2 pt-1 border-t border-frost-steel/60 dark:border-steam-steel/30 text-xs">
                  {topGenres.map((g, idx) => {
                    const percent = totalHours > 0 ? Math.round((g.hours / totalHours) * 100) : 0;
                    const barColor =
                      idx === 0
                        ? 'bg-sky-accent dark:bg-steam-blue'
                        : idx === 1
                        ? 'bg-emerald-500'
                        : 'bg-purple-500';
                    return (
                      <div key={g.genre} className="space-y-1">
                        <div className="flex justify-between text-[11px] text-active-slate dark:text-steam-light">
                          <span className="truncate max-w-[130px] font-medium">{g.genre}</span>
                          <span className="font-mono text-charcoal-text dark:text-pure-white">
                            {g.hours}h ({percent}%)
                          </span>
                        </div>
                        <div className="h-1.5 w-full bg-frost-steel/40 dark:bg-steam-steel/40 rounded-full overflow-hidden">
                          <div
                            className={`h-full ${barColor} rounded-full transition-all duration-500`}
                            style={{ width: `${percent}%` }}
                          />
                        </div>
                      </div>
                    );
                  })}
                </div>
              ) : (
                <p className="text-[11px] text-active-slate/70 dark:text-steam-light/70 leading-relaxed text-center pt-2">
                  {isAuthenticated
                    ? 'Aún no has registrado horas. Publica una reseña para calcular tu distribución de géneros.'
                    : 'Conecta tu cuenta para sincronizar tus horas de gameplay y desbloquear tu gráfico analítico.'}
                </p>
              )}
            </div>
          </div>
        )}
      </div>
    </aside>
  );
}
