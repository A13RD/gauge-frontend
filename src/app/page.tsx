import React from 'react';
import Link from 'next/link';
import { AppShell } from '@/features/common/components/AppShell';
import { Button } from '@/features/common/components/Button';
import {
  Sparkles,
  ChevronRight,
  ChevronLeft,
  Star,
  Clock,
  Compass,
  SquarePen,
  Flame,
  Gamepad2,
  Layers,
  MessageSquareText,
  TrendingUp,
} from 'lucide-react';

export default function HomePage() {
  return (
    <AppShell>
      <div className="flex flex-col gap-6 sm:gap-8">
        {/* QUICK STATS CARD: Específico de Móvil (según boceto oficial BocetoPaginaResponsive.jpg) */}
        <div className="lg:hidden glass-panel rounded-2xl p-4 border border-frost-steel dark:border-steam-steel/50 shadow-md">
          <div className="flex items-center justify-between mb-2">
            <span className="text-[11px] font-bold uppercase tracking-wider font-mono text-active-slate/80 dark:text-steam-light/70">
              Quick Stats
            </span>
            <span className="text-[10px] px-2 py-0.5 rounded-full bg-sky-accent/15 dark:bg-steam-blue/20 text-sky-accent dark:text-steam-blue font-mono font-medium">
              Comunidad
            </span>
          </div>
          <div className="flex items-center gap-2">
            <div className="flex-1 flex items-center justify-center gap-2 py-2 px-3 rounded-xl bg-white dark:bg-steam-dark/60 border border-frost-steel dark:border-steam-steel/40">
              <Clock className="w-4 h-4 text-sky-accent dark:text-steam-blue" aria-hidden="true" />
              <span className="text-xs font-mono font-bold text-charcoal-text dark:text-pure-white">
                -- h jugadas
              </span>
            </div>
            <div className="flex-1 flex items-center justify-center gap-2 py-2 px-3 rounded-xl bg-white dark:bg-steam-dark/60 border border-frost-steel dark:border-steam-steel/40">
              <Star className="w-4 h-4 text-amber-500" aria-hidden="true" />
              <span className="text-xs font-mono font-bold text-charcoal-text dark:text-pure-white">
                -- Reseñas
              </span>
            </div>
          </div>
        </div>

        {/* ======================================================== */}
        {/* A. HERO DESTACADO: Tarjeta cinematográfica estilo Valorant */}
        {/* ======================================================== */}
        <section
          aria-label="Videojuego destacado del momento"
          className="relative glass-panel rounded-3xl p-6 sm:p-8 md:p-10 overflow-hidden border border-frost-steel dark:border-steam-steel/40 shadow-2xl transition-all group"
        >
          {/* Fondo inmersivo Neo-Arcade con degradados atmosféricos */}
          <div
            aria-hidden="true"
            className="absolute inset-0 bg-gradient-to-r from-sky-accent/10 via-transparent to-sky-accent/5 dark:from-steam-blue/15 dark:via-steam-navy/60 dark:to-transparent pointer-events-none"
          />
          <div
            aria-hidden="true"
            className="absolute -top-32 -right-32 w-96 h-96 rounded-full bg-sky-accent/20 dark:bg-steam-blue/20 blur-3xl pointer-events-none"
          />

          <div className="relative z-10 flex flex-col justify-between min-h-[300px] sm:min-h-[360px] gap-6">
            {/* Cabecera del Hero con badge y dial de nota */}
            <div className="flex items-start justify-between gap-4">
              <div className="flex flex-wrap items-center gap-2">
                <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-xl bg-sky-accent/15 dark:bg-steam-blue/20 border border-sky-accent/30 dark:border-steam-blue/40 text-sky-accent dark:text-steam-blue text-xs font-mono font-bold">
                  <Flame className="w-3.5 h-3.5" aria-hidden="true" />
                  JUEGO DESTACADO · HERO
                </span>
                <span className="text-xs font-mono text-active-slate/70 dark:text-steam-light/70 px-2 py-0.5 rounded-md bg-frost-steel/40 dark:bg-steam-steel/30">
                  FPS Táctico / Acción
                </span>
              </div>

              {/* Dial de calificación comunitaria */}
              <div className="flex flex-col items-end shrink-0">
                <div className="flex items-center gap-1 px-3 py-1.5 rounded-2xl bg-white dark:bg-steam-navy border border-frost-steel dark:border-steam-blue/40 text-sky-accent dark:text-steam-blue shadow-md font-mono font-black text-lg sm:text-xl">
                  <Star className="w-5 h-5 fill-current" aria-hidden="true" />
                  <span>9.6</span>
                  <span className="text-xs text-active-slate/60 dark:text-steam-light/60 font-normal">/10</span>
                </div>
                <span className="text-[10px] text-active-slate/60 dark:text-steam-light/60 font-mono mt-1">
                  Puntuación Media
                </span>
              </div>
            </div>

            {/* Contenido principal del juego insignia */}
            <div className="max-w-xl space-y-3">
              <h1 className="text-3xl sm:text-4xl md:text-5xl font-black tracking-tight text-charcoal-text dark:text-pure-white font-sans uppercase">
                VALORANT MATRIX
              </h1>
              <p className="text-sm sm:text-base text-active-slate dark:text-steam-light leading-relaxed">
                Combina precisión en el disparo y habilidades tácticas en un entorno
                competitivo 5v5. Explora el análisis técnico, tiempos promedio y
                evaluaciones fundamentadas de la comunidad.
              </p>
            </div>

            {/* Acciones principales y controles de carrusel */}
            <div className="flex flex-wrap items-center justify-between gap-4 pt-2 border-t border-frost-steel/60 dark:border-steam-steel/30">
              <div className="flex items-center gap-3">
                <Link href="/catalogo">
                  <Button
                    variant="primary"
                    size="md"
                    leftIcon={<Compass className="w-4 h-4" />}
                  >
                    Consultar Ficha Técnica
                  </Button>
                </Link>
                <Link href="/resenas/nueva">
                  <Button
                    variant="secondary"
                    size="md"
                    leftIcon={<SquarePen className="w-4 h-4" />}
                  >
                    Publicar Reseña
                  </Button>
                </Link>
              </div>

              {/* Indicadores de paginación del carrusel Hero */}
              <div className="flex items-center gap-2">
                <div className="flex items-center gap-1.5" aria-label="Posición de carrusel">
                  <span className="w-6 h-1.5 rounded-full bg-sky-accent dark:bg-steam-blue shadow-[0_0_8px_rgba(2,132,199,0.8)]" />
                  <span className="w-1.5 h-1.5 rounded-full bg-frost-steel dark:bg-steam-steel/60" />
                  <span className="w-1.5 h-1.5 rounded-full bg-frost-steel dark:bg-steam-steel/60" />
                  <span className="w-1.5 h-1.5 rounded-full bg-frost-steel dark:bg-steam-steel/60" />
                </div>
                <div className="hidden sm:flex items-center gap-1 ml-2">
                  <button
                    type="button"
                    aria-label="Juego anterior"
                    className="p-1.5 rounded-lg text-active-slate dark:text-steam-light hover:bg-frost-bg dark:hover:bg-steam-steel/40 border border-frost-steel dark:border-steam-steel/50"
                  >
                    <ChevronLeft className="w-4 h-4" aria-hidden="true" />
                  </button>
                  <button
                    type="button"
                    aria-label="Siguiente juego"
                    className="p-1.5 rounded-lg text-active-slate dark:text-steam-light hover:bg-frost-bg dark:hover:bg-steam-steel/40 border border-frost-steel dark:border-steam-steel/50"
                  >
                    <ChevronRight className="w-4 h-4" aria-hidden="true" />
                  </button>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* ======================================================== */}
        {/* B. NEW GAMES: Carrusel horizontal snap-scroll de juegos  */}
        {/* ======================================================== */}
        <section aria-label="Carrusel de nuevos lanzamientos" className="space-y-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2.5">
              <div className="p-2 rounded-xl bg-white dark:bg-steam-navy border border-frost-steel dark:border-steam-steel/60 text-sky-accent dark:text-steam-blue shadow-sm">
                <Gamepad2 className="w-5 h-5" aria-hidden="true" />
              </div>
              <div>
                <h2 className="text-base sm:text-lg font-bold text-charcoal-text dark:text-pure-white font-mono uppercase">
                  Nuevos Juegos
                </h2>
                <p className="text-xs text-active-slate/70 dark:text-steam-light/70">
                  Lanzamientos y títulos incorporados recientemente
                </p>
              </div>
            </div>

            <Link
              href="/catalogo"
              className="inline-flex items-center gap-1 text-xs font-mono font-bold text-sky-accent dark:text-steam-blue hover:underline"
            >
              <span>Ver catálogo</span>
              <ChevronRight className="w-4 h-4" aria-hidden="true" />
            </Link>
          </div>

          {/* Contenedor del carrusel con snap scrolling fluido */}
          <div className="flex gap-4 overflow-x-auto pb-3 snap-x snap-mandatory scrollbar-none -mx-1 px-1">
            {[
              {
                title: 'Silent Hill 2 Remake',
                genre: 'Survival Horror',
                rating: '9.3',
                hours: '16h avg',
              },
              {
                title: 'Cyberpunk 2077',
                genre: 'RPG / Acción',
                rating: '9.1',
                hours: '45h avg',
              },
              {
                title: 'Elden Ring: Shadow',
                genre: 'Action RPG',
                rating: '9.8',
                hours: '60h avg',
              },
              {
                title: 'Alan Wake 2',
                genre: 'Psicológico',
                rating: '9.0',
                hours: '18h avg',
              },
              {
                title: 'Hollow Knight: Silksong',
                genre: 'Metroidvania',
                rating: '9.5',
                hours: '28h avg',
              },
            ].map((game, idx) => (
              <div
                key={idx}
                className="min-w-[200px] sm:min-w-[220px] max-w-[240px] shrink-0 snap-start glass-panel rounded-2xl p-3 border border-frost-steel dark:border-steam-steel/50 shadow-md group hover:border-sky-accent dark:hover:border-steam-blue transition-all duration-300 flex flex-col justify-between"
              >
                {/* Portada con marco de relación 3:4 */}
                <div className="relative aspect-[3/4] w-full rounded-xl overflow-hidden bg-frost-bg dark:bg-steam-steel/30 border border-frost-steel/60 dark:border-steam-steel/50 flex flex-col justify-between p-3 mb-3">
                  <div className="flex justify-between items-start">
                    <span className="text-[10px] font-mono px-2 py-0.5 rounded-md bg-white/90 dark:bg-steam-dark/90 text-charcoal-text dark:text-pure-white font-bold shadow-sm">
                      #{idx + 1}
                    </span>
                    <span className="inline-flex items-center gap-1 text-[11px] font-mono font-bold px-2 py-0.5 rounded-md bg-sky-accent text-white dark:bg-steam-blue dark:text-steam-dark shadow-sm">
                      ★ {game.rating}
                    </span>
                  </div>

                  <div className="text-center py-6">
                    <Gamepad2 className="w-10 h-10 mx-auto text-active-slate/40 dark:text-steam-light/30 group-hover:scale-110 transition-transform" aria-hidden="true" />
                  </div>

                  <span className="text-[10px] text-center font-mono text-active-slate/80 dark:text-steam-light/70 truncate">
                    {game.hours}
                  </span>
                </div>

                {/* Título y metadatos */}
                <div className="space-y-1">
                  <h3 className="font-bold text-sm text-charcoal-text dark:text-pure-white truncate group-hover:text-sky-accent dark:group-hover:text-steam-blue transition-colors">
                    {game.title}
                  </h3>
                  <div className="flex items-center justify-between text-[11px] text-active-slate/80 dark:text-steam-light/70">
                    <span className="truncate">{game.genre}</span>
                    <span className="font-mono text-sky-accent dark:text-steam-blue font-semibold">Ficha →</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* ======================================================== */}
        {/* C. RECOMENDACIÓN ANCHA: Banner horizontal de título      */}
        {/* ======================================================== */}
        <section
          aria-label="Recomendación destacada de la comunidad"
          className="glass-panel rounded-3xl p-5 sm:p-7 border border-frost-steel dark:border-steam-steel/40 shadow-lg relative overflow-hidden"
        >
          <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-5">
            <div className="space-y-2 max-w-xl">
              <div className="inline-flex items-center gap-1.5 text-xs font-mono font-bold text-sky-accent dark:text-steam-blue">
                <Sparkles className="w-3.5 h-3.5" aria-hidden="true" />
                RECOMENDACIÓN ANCHA · JUGABILIDAD VERIFICADA
              </div>
              <h3 className="text-xl sm:text-2xl font-black text-charcoal-text dark:text-pure-white font-sans">
                Silent Hill 2 — Experiencia Psicológica
              </h3>
              <p className="text-xs sm:text-sm text-active-slate dark:text-steam-light leading-relaxed">
                Atmósfera sonora envolvente, niebla volumétrica optimizada y rediseño de
                acertijos mecánicos. Consulta la comparativa de horas jugadas por la comunidad.
              </p>
            </div>

            <div className="flex flex-wrap items-center gap-3 shrink-0">
              <Link href="/catalogo">
                <Button variant="primary" size="md">
                  Ver Reseñas
                </Button>
              </Link>
            </div>
          </div>
        </section>

        {/* ======================================================== */}
        {/* D. ÚLTIMAS RESEÑAS: Sección del feed de la comunidad     */}
        {/* ======================================================== */}
        <section aria-label="Últimas reseñas de la comunidad" className="space-y-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2.5">
              <div className="p-2 rounded-xl bg-white dark:bg-steam-navy border border-frost-steel dark:border-steam-steel/60 text-sky-accent dark:text-steam-blue shadow-sm">
                <MessageSquareText className="w-5 h-5" aria-hidden="true" />
              </div>
              <div>
                <h2 className="text-base sm:text-lg font-bold text-charcoal-text dark:text-pure-white font-mono uppercase">
                  Últimas Reseñas
                </h2>
                <p className="text-xs text-active-slate/70 dark:text-steam-light/70">
                  Opiniones fundamentadas y horas reportadas por jugadores
                </p>
              </div>
            </div>

            <Link
              href="/resenas/nueva"
              className="inline-flex items-center gap-1 text-xs font-mono font-bold text-sky-accent dark:text-steam-blue hover:underline"
            >
              <span>Escribir reseña</span>
              <ChevronRight className="w-4 h-4" aria-hidden="true" />
            </Link>
          </div>

          {/* Grilla de reseñas de ejemplo estructural (según contrato oficial) */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="glass-panel rounded-2xl p-5 border border-frost-steel dark:border-steam-steel/50 shadow-sm flex flex-col justify-between gap-4">
              <div className="flex items-start justify-between gap-3">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl bg-frost-steel/40 dark:bg-steam-steel/40 flex items-center justify-center font-bold font-mono text-sm text-charcoal-text dark:text-pure-white">
                    AM
                  </div>
                  <div>
                    <h4 className="font-bold text-sm text-charcoal-text dark:text-pure-white">
                      Alex Mercer
                    </h4>
                    <span className="text-[11px] text-active-slate/70 dark:text-steam-light/60 font-mono">
                      Silent Hill 2 · 16 hrs jugadas
                    </span>
                  </div>
                </div>
                <div className="px-2.5 py-1 rounded-xl bg-sky-accent/15 dark:bg-steam-blue/20 text-sky-accent dark:text-steam-blue font-mono font-bold text-sm">
                  ★ 9.5
                </div>
              </div>
              <p className="text-xs sm:text-sm text-active-slate dark:text-steam-light leading-relaxed">
                “Atmósfera sonora impecable y recreación fidedigna de la niebla. El combate
                se siente deliberadamente pesado para transmitir tensión constante.”
              </p>
              <div className="text-[10px] text-active-slate/60 dark:text-steam-light/50 font-mono">
                Publicado recientemente
              </div>
            </div>

            <div className="glass-panel rounded-2xl p-5 border border-frost-steel dark:border-steam-steel/50 shadow-sm flex flex-col justify-between gap-4">
              <div className="flex items-start justify-between gap-3">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl bg-frost-steel/40 dark:bg-steam-steel/40 flex items-center justify-center font-bold font-mono text-sm text-charcoal-text dark:text-pure-white">
                    EL
                  </div>
                  <div>
                    <h4 className="font-bold text-sm text-charcoal-text dark:text-pure-white">
                      Elena Rostova
                    </h4>
                    <span className="text-[11px] text-active-slate/70 dark:text-steam-light/60 font-mono">
                      Valorant · 120 hrs jugadas
                    </span>
                  </div>
                </div>
                <div className="px-2.5 py-1 rounded-xl bg-sky-accent/15 dark:bg-steam-blue/20 text-sky-accent dark:text-steam-blue font-mono font-bold text-sm">
                  ★ 9.0
                </div>
              </div>
              <p className="text-xs sm:text-sm text-active-slate dark:text-steam-light leading-relaxed">
                “El balance de agentes sigue siendo el punto más sólido del juego. Las rotaciones
                en defensa requieren buena coordinación y la economía de créditos penaliza el juego imprudente.”
              </p>
              <div className="text-[10px] text-active-slate/60 dark:text-steam-light/50 font-mono">
                Publicado recientemente
              </div>
            </div>
          </div>
        </section>
      </div>
    </AppShell>
  );
}
