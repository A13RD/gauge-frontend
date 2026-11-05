import React from 'react';
import Link from 'next/link';
import { AppShell } from '@/features/common/components/AppShell';
import { Button } from '@/features/common/components/Button';
import {
  Compass,
  Sparkles,
  Gamepad2,
  TrendingUp,
  BarChart3,
  Layers,
} from 'lucide-react';

export default function HomePage() {
  return (
    <AppShell showRightDock={false}>
      <div className="flex flex-col gap-6 sm:gap-8">
        {/* Banner Hero Principal de Identidad GAUGE */}
        <section
          aria-label="Presentación de GAUGE"
          className="relative glass-panel rounded-3xl p-6 sm:p-10 md:p-12 overflow-hidden border border-steam-steel/40 dark:border-steam-steel/40 light:border-frost-steel shadow-2xl"
        >
          {/* Acento luminoso de fondo */}
          <div
            aria-hidden="true"
            className="absolute -top-24 -right-24 w-80 h-80 rounded-full bg-steam-blue/15 light:bg-sky-accent/15 blur-3xl pointer-events-none"
          />

          <div className="relative z-10 max-w-2xl flex flex-col gap-4 sm:gap-6">
            <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-xl bg-steam-blue/15 border border-steam-blue/30 text-steam-blue light:text-sky-accent text-xs font-mono font-semibold w-fit">
              <Sparkles className="w-3.5 h-3.5" />
              <span>Neo-Arcade Gameplay Matrix</span>
            </div>

            <div className="space-y-2">
              <h1 className="text-3xl sm:text-4xl md:text-5xl font-black tracking-tight text-white light:text-charcoal-text font-sans">
                GAUGE
              </h1>
              <p className="text-sm sm:text-base md:text-lg font-mono text-steam-blue light:text-sky-accent font-medium">
                Gaming Assessment & User Gameplay Evaluation
              </p>
            </div>

            <p className="text-sm sm:text-base text-steam-light light:text-active-slate leading-relaxed">
              Plataforma comunitaria de análisis técnico y evaluación de experiencia
              de juego. Explora títulos, registra tus horas de gameplay y comparte
              reseñas fundamentadas con la comunidad.
            </p>

            <div className="flex flex-wrap items-center gap-3 pt-2">
              <Link href="/catalogo">
                <Button
                  variant="primary"
                  size="md"
                  leftIcon={<Compass className="w-4 h-4" />}
                >
                  Explorar Catálogo
                </Button>
              </Link>
              <Link href="/login">
                <Button
                  variant="secondary"
                  size="md"
                  leftIcon={<Gamepad2 className="w-4 h-4" />}
                >
                  Iniciar Sesión
                </Button>
              </Link>
            </div>
          </div>
        </section>

        {/* Espacios arquitectónicos preparados para las siguientes etapas */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 sm:gap-6">
          {/* Placeholder: Destacado Cinemático */}
          <div className="glass-panel rounded-2xl p-6 border border-steam-steel/30 dark:border-steam-steel/30 light:border-frost-steel flex flex-col justify-between min-h-[160px] group hover:border-steam-blue/50 transition-colors">
            <div className="flex items-center justify-between mb-3">
              <div className="p-2.5 rounded-xl bg-steam-steel/30 text-steam-blue light:text-sky-accent">
                <Layers className="w-5 h-5" />
              </div>
              <span className="text-[11px] font-mono text-steam-light/60 light:text-active-slate/60 uppercase">
                Etapa 2
              </span>
            </div>
            <div>
              <h3 className="font-bold text-white light:text-charcoal-text text-base mb-1">
                Destacado Cinemático
              </h3>
              <p className="text-xs text-steam-light/70 light:text-active-slate/70 leading-relaxed">
                Espacio preparado para la tarjeta Hero estilo Valorant y carrusel de lanzamientos.
              </p>
            </div>
          </div>

          {/* Placeholder: Catálogo & Filtros */}
          <div className="glass-panel rounded-2xl p-6 border border-steam-steel/30 dark:border-steam-steel/30 light:border-frost-steel flex flex-col justify-between min-h-[160px] group hover:border-steam-blue/50 transition-colors">
            <div className="flex items-center justify-between mb-3">
              <div className="p-2.5 rounded-xl bg-steam-steel/30 text-steam-blue light:text-sky-accent">
                <TrendingUp className="w-5 h-5" />
              </div>
              <span className="text-[11px] font-mono text-steam-light/60 light:text-active-slate/60 uppercase">
                Etapa 2
              </span>
            </div>
            <div>
              <h3 className="font-bold text-white light:text-charcoal-text text-base mb-1">
                Catálogo Dinámico
              </h3>
              <p className="text-xs text-steam-light/70 light:text-active-slate/70 leading-relaxed">
                Estructura lista para la grilla de títulos sincronizada con la API y filtros por género.
              </p>
            </div>
          </div>

          {/* Placeholder: Estadísticas & Métricas */}
          <div className="glass-panel rounded-2xl p-6 border border-steam-steel/30 dark:border-steam-steel/30 light:border-frost-steel flex flex-col justify-between min-h-[160px] group hover:border-steam-blue/50 transition-colors">
            <div className="flex items-center justify-between mb-3">
              <div className="p-2.5 rounded-xl bg-steam-steel/30 text-steam-blue light:text-sky-accent">
                <BarChart3 className="w-5 h-5" />
              </div>
              <span className="text-[11px] font-mono text-steam-light/60 light:text-active-slate/60 uppercase">
                Etapa 3
              </span>
            </div>
            <div>
              <h3 className="font-bold text-white light:text-charcoal-text text-base mb-1">
                Métricas de Gameplay
              </h3>
              <p className="text-xs text-steam-light/70 light:text-active-slate/70 leading-relaxed">
                Superficie destinada a gráficas Recharts de horas jugadas y distribución por género.
              </p>
            </div>
          </div>
        </div>
      </div>
    </AppShell>
  );
}
