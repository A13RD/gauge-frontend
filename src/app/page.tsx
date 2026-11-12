'use client';

import React from 'react';
import Link from 'next/link';
import { AppShell } from '@/features/common/components/AppShell';
import { Button } from '@/features/common/components/Button';
import {
  Sparkles,
  ChevronRight,
  Star,
  Clock,
  Compass,
  SquarePen,
  MessageSquareText,
} from 'lucide-react';
import { useGames } from '@/features/games/hooks/useGames';
import { HeroValorantCard } from '@/features/games/components/HeroValorantCard';
import { NewGamesCarousel } from '@/features/games/components/NewGamesCarousel';
import { getGameRating } from '@/features/games/domain/game.types';
import { useUserStats } from '@/features/users';

export default function HomePage() {
  const { games, isLoading, error, refetch } = useGames({
    limit: 10,
    sort: 'recent',
  });
  const { stats } = useUserStats();

  // Identificar si algún juego cargado incluye reseñas reales para la sección de comunidad
  const gamesWithReviews = games.filter(
    (g) => Array.isArray(g.reviews) && g.reviews.length > 0
  );
  const communityReviews = gamesWithReviews.flatMap((g) =>
    (g.reviews || []).map((rev) => ({
      ...rev,
      gameTitle: g.title,
      gameId: g.id,
    }))
  );
  const communityTotalHours = communityReviews.reduce(
    (acc, rev) => acc + (rev.hoursPlayed || 0),
    0
  );
  const displayedHours = stats?.totalHours ? stats.totalHours : communityTotalHours;

  // Seleccionar un juego destacado secundario para la recomendación ancha
  const recommendedGame = games.length > 1 ? games[1] : games[0];
  const recommendedRating = recommendedGame ? getGameRating(recommendedGame) : null;

  return (
    <AppShell>
      <div className="flex flex-col gap-6 sm:gap-8">
        {/* QUICK STATS CARD: Específico de Móvil (según boceto oficial BocetoPaginaResponsive.jpg) */}
        <div className="lg:hidden glass-panel rounded-2xl p-3.5 sm:p-4 border border-frost-steel dark:border-steam-steel/50 shadow-md">
          <div className="flex items-center justify-between mb-2">
            <span className="text-[11px] font-bold uppercase tracking-wider font-mono text-active-slate/80 dark:text-steam-light/70">
              Quick Stats
            </span>
            <span className="text-[10px] px-2 py-0.5 rounded-full bg-sky-accent/15 dark:bg-steam-blue/20 text-sky-accent dark:text-steam-blue font-mono font-medium">
              {stats?.totalHours ? 'Personal' : 'Comunidad'}
            </span>
          </div>
          <div className="grid grid-cols-2 gap-2">
            <div className="min-w-0 flex items-center justify-center gap-1.5 py-2 px-2.5 rounded-xl bg-white dark:bg-steam-dark/60 border border-frost-steel dark:border-steam-steel/40">
              <Clock className="w-4 h-4 text-sky-accent dark:text-steam-blue shrink-0" aria-hidden="true" />
              <span className="text-xs font-mono font-bold text-charcoal-text dark:text-pure-white truncate">
                {isLoading ? '...' : `${displayedHours}h registradas`}
              </span>
            </div>
            <div className="min-w-0 flex items-center justify-center gap-1.5 py-2 px-2.5 rounded-xl bg-white dark:bg-steam-dark/60 border border-frost-steel dark:border-steam-steel/40">
              <Star className="w-4 h-4 text-amber-500 shrink-0" aria-hidden="true" />
              <span className="text-xs font-mono font-bold text-charcoal-text dark:text-pure-white truncate">
                {isLoading ? '...' : `${games.length} Títulos`}
              </span>
            </div>
          </div>
        </div>

        {/* ======================================================== */}
        {/* A. HERO DESTACADO: Tarjeta cinematográfica con carrusel  */}
        {/* ======================================================== */}
        <HeroValorantCard
          games={games}
          isLoading={isLoading}
          error={error}
          onRetry={refetch}
        />

        {/* ======================================================== */}
        {/* B. NEW GAMES: Carrusel horizontal snap-scroll de juegos  */}
        {/* ======================================================== */}
        <NewGamesCarousel
          games={games}
          isLoading={isLoading}
        />

        {/* ======================================================== */}
        {/* C. RECOMENDACIÓN ANCHA: Banner horizontal de título      */}
        {/* ======================================================== */}
        {recommendedGame ? (
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
                  {recommendedGame.title} {recommendedGame.genre ? `— ${recommendedGame.genre.name}` : ''}
                </h3>
                <p className="text-xs sm:text-sm text-active-slate dark:text-steam-light leading-relaxed line-clamp-2">
                  {recommendedGame.description ||
                    'Consulta el análisis técnico, las impresiones de la comunidad y la comparativa de horas registradas.'}
                </p>
                {recommendedRating !== null && (
                  <div className="inline-flex items-center gap-1 text-xs font-mono font-bold text-amber-500">
                    <Star className="w-3.5 h-3.5 fill-current" />
                    <span>Calificación promedio: {recommendedRating.toFixed(1)} / 10</span>
                  </div>
                )}
              </div>

              <div className="flex flex-wrap items-center gap-3 shrink-0">
                <Link href={`/catalogo/${recommendedGame.id}`}>
                  <Button variant="primary" size="md" leftIcon={<Compass className="w-4 h-4" />}>
                    Ver Ficha Técnica
                  </Button>
                </Link>
              </div>
            </div>
          </section>
        ) : !isLoading && !error ? (
          <section
            aria-label="Recomendación destacada de la comunidad"
            className="glass-panel rounded-3xl p-5 sm:p-7 border border-frost-steel dark:border-steam-steel/40 shadow-lg relative overflow-hidden"
          >
            <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-5">
              <div className="space-y-2 max-w-xl">
                <div className="inline-flex items-center gap-1.5 text-xs font-mono font-bold text-sky-accent dark:text-steam-blue">
                  <Sparkles className="w-3.5 h-3.5" aria-hidden="true" />
                  COMUNIDAD GAUGE · EVALUACIÓN TÉCNICA
                </div>
                <h3 className="text-xl sm:text-2xl font-black text-charcoal-text dark:text-pure-white font-sans">
                  Explora el Catálogo Comunitario
                </h3>
                <p className="text-xs sm:text-sm text-active-slate dark:text-steam-light leading-relaxed">
                  Evalúa títulos según horas reales de juego y consulta la base de conocimiento técnico generada por la comunidad.
                </p>
              </div>

              <div className="flex flex-wrap items-center gap-3 shrink-0">
                <Link href="/catalogo">
                  <Button variant="primary" size="md" leftIcon={<Compass className="w-4 h-4" />}>
                    Explorar Catálogo
                  </Button>
                </Link>
              </div>
            </div>
          </section>
        ) : null}

        {/* ======================================================== */}
        {/* D. ÚLTIMAS RESEÑAS: Feed de la comunidad                 */}
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

          {/* Grilla de Reseñas */}
          {communityReviews.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {communityReviews.slice(0, 4).map((rev) => (
                <div
                  key={rev.id}
                  className="glass-panel rounded-2xl p-5 border border-frost-steel dark:border-steam-steel/50 shadow-sm flex flex-col justify-between gap-4"
                >
                  <div className="flex items-start justify-between gap-3">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-xl bg-frost-steel/40 dark:bg-steam-steel/40 flex items-center justify-center font-bold font-mono text-sm text-charcoal-text dark:text-pure-white">
                        {rev.user?.name ? rev.user.name.substring(0, 2).toUpperCase() : 'JG'}
                      </div>
                      <div>
                        <h4 className="font-bold text-sm text-charcoal-text dark:text-pure-white">
                          {rev.user?.name || 'Jugador Verificado'}
                        </h4>
                        <span className="text-[11px] text-active-slate/70 dark:text-steam-light/60 font-mono">
                          {rev.gameTitle} · {rev.hoursPlayed} hrs registradas
                        </span>
                      </div>
                    </div>
                    <div className="px-2.5 py-1 rounded-xl bg-sky-accent/15 dark:bg-steam-blue/20 text-sky-accent dark:text-steam-blue font-mono font-bold text-sm">
                      ★ {rev.rating}
                    </div>
                  </div>
                  <p className="text-xs sm:text-sm text-active-slate dark:text-steam-light leading-relaxed">
                    “{rev.content}”
                  </p>
                  <div className="text-[10px] text-active-slate/60 dark:text-steam-light/50 font-mono flex justify-between items-center">
                    <span>
                      {rev.createdAt
                        ? new Date(rev.createdAt).toLocaleDateString('es-ES')
                        : 'Reciente'}
                    </span>
                    <Link
                      href={`/catalogo/${rev.gameId}`}
                      className="text-sky-accent dark:text-steam-blue hover:underline"
                    >
                      Ver juego →
                    </Link>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="glass-panel rounded-2xl p-6 border border-frost-steel dark:border-steam-steel/40 text-center flex flex-col items-center justify-center gap-3">
              <p className="text-xs sm:text-sm text-active-slate dark:text-steam-light max-w-md">
                Sé el primero en compartir tu análisis técnico sobre los títulos del catálogo y ayudar a la comunidad con tus horas de juego.
              </p>
              <Link href="/resenas/nueva">
                <Button variant="secondary" size="sm" leftIcon={<SquarePen className="w-3.5 h-3.5" />}>
                  Publicar primera reseña
                </Button>
              </Link>
            </div>
          )}
        </section>
      </div>
    </AppShell>
  );
}
