'use client';

import React, { Suspense, useState, useRef } from 'react';
import Link from 'next/link';
import { useParams, useRouter } from 'next/navigation';
import { AppShell } from '@/features/common/components/AppShell';
import { Button } from '@/features/common/components/Button';
import { useGameDetail } from '@/features/games/hooks/useGameDetail';
import {
  formatReleaseDate,
  getGameRating,
} from '@/features/games/domain/game.types';
import {
  GameTrailerCard,
  GameReviewScoreCard,
} from '@/features/games/components';
import {
  ArrowLeft,
  Calendar,
  Clock,
  Star,
  SquarePen,
  Gamepad2,
  MessageSquareText,
  User,
  Share2,
  Check,
  Compass,
  Sparkles,
  ShieldCheck,
} from 'lucide-react';
import { ErrorAlert } from '@/features/common/components/ErrorAlert';
import { EmptyState } from '@/features/common/components/EmptyState';

function GameDetailContent() {
  const params = useParams();
  const router = useRouter();
  const rawId = params?.id;
  const gameId = Array.isArray(rawId) ? rawId[0] : rawId || '';

  const { game, isLoading, error, statusCode, refetch } = useGameDetail(gameId);

  const [bannerError, setBannerError] = useState(false);
  const [copied, setCopied] = useState(false);
  const reviewsSectionRef = useRef<HTMLElement>(null);

  const handleCopyLink = () => {
    if (typeof window !== 'undefined') {
      navigator.clipboard.writeText(window.location.href);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  const handleScrollToReviews = () => {
    if (reviewsSectionRef.current) {
      reviewsSectionRef.current.scrollIntoView({ behavior: 'smooth' });
    } else {
      const el = document.getElementById('resenas-comunidad');
      if (el) el.scrollIntoView({ behavior: 'smooth' });
    }
  };

  // 1. Estado de Carga
  if (isLoading) {
    return (
      <div className="flex flex-col gap-6 animate-pulse">
        {/* Skeleton de navegación */}
        <div className="h-6 w-48 rounded-lg bg-frost-steel/40 dark:bg-steam-steel/30" />

        {/* Skeleton Hero Panorámico */}
        <div className="glass-panel rounded-3xl p-6 sm:p-10 border border-frost-steel dark:border-steam-steel/40 min-h-[460px] flex flex-col lg:flex-row gap-8">
          <div className="flex-1 space-y-4">
            <div className="flex gap-2">
              <div className="h-6 w-24 rounded-full bg-frost-steel/40 dark:bg-steam-steel/30" />
              <div className="h-6 w-32 rounded-full bg-frost-steel/40 dark:bg-steam-steel/30" />
            </div>
            <div className="h-12 w-3/4 rounded-xl bg-frost-steel/60 dark:bg-steam-steel/50" />
            <div className="h-28 w-full rounded-xl bg-frost-steel/30 dark:bg-steam-steel/20" />
            <div className="h-12 w-44 rounded-2xl bg-frost-steel/50 dark:bg-steam-steel/40" />
          </div>
          <div className="w-full lg:w-80 flex flex-col gap-4">
            <div className="h-32 rounded-2xl bg-frost-steel/30 dark:bg-steam-steel/20" />
            <div className="h-44 rounded-2xl bg-frost-steel/30 dark:bg-steam-steel/20" />
          </div>
        </div>

        {/* Skeleton de Reseñas */}
        <div className="space-y-4 pt-4">
          <div className="h-8 w-44 rounded-lg bg-frost-steel/40 dark:bg-steam-steel/30" />
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="h-40 rounded-2xl bg-frost-steel/30 dark:bg-steam-steel/20" />
            <div className="h-40 rounded-2xl bg-frost-steel/30 dark:bg-steam-steel/20" />
          </div>
        </div>
      </div>
    );
  }

  // 2. Estado de Error o No Encontrado
  if (error || !game) {
    return (
      <div className="py-12 max-w-xl mx-auto flex flex-col gap-6">
        <ErrorAlert
          title={statusCode === 404 ? 'Videojuego no encontrado' : 'Error al cargar la ficha'}
          message={error || 'No se pudo recuperar la información del videojuego.'}
          statusCode={statusCode || undefined}
          onRetry={refetch}
        />
        <div className="flex justify-center gap-3">
          <Button
            variant="outline"
            size="md"
            onClick={() => router.push('/catalogo')}
            leftIcon={<ArrowLeft className="w-4 h-4" />}
          >
            Volver al Catálogo
          </Button>
        </div>
      </div>
    );
  }

  // 3. Renderizado de la Ficha Técnica Rediseñada (Estilo Spider-Man Reference)
  const rating = getGameRating(game);
  const reviews = Array.isArray(game.reviews) ? game.reviews : [];
  const bannerSource = game.bannerUrl || game.coverUrl;
  const totalHoursReported = reviews.reduce((sum, r) => sum + (r.hoursPlayed || 0), 0);

  return (
    <div className="flex flex-col gap-6 sm:gap-8 pb-10">
      {/* Barra de Navegación Superior y Compartir */}
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div className="flex items-center gap-2 text-xs font-mono">
          <Link
            href="/catalogo"
            className="inline-flex items-center gap-1.5 text-active-slate hover:text-charcoal-text dark:text-steam-light/80 dark:hover:text-pure-white transition-colors"
          >
            <ArrowLeft className="w-3.5 h-3.5" aria-hidden="true" />
            <span>Volver al Catálogo</span>
          </Link>
          <span className="text-frost-steel dark:text-steam-steel">/</span>
          <span className="text-charcoal-text dark:text-pure-white truncate max-w-[200px] sm:max-w-xs font-medium">
            {game.title}
          </span>
        </div>

        <button
          type="button"
          onClick={handleCopyLink}
          aria-label="Compartir enlace de la ficha"
          className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-mono bg-white dark:bg-steam-navy/80 border border-frost-steel dark:border-steam-steel/50 text-active-slate dark:text-steam-light hover:border-sky-accent dark:hover:border-steam-blue transition-colors cursor-pointer"
        >
          {copied ? (
            <>
              <Check className="w-3.5 h-3.5 text-emerald-500" aria-hidden="true" />
              <span className="text-emerald-500 font-bold">Enlace copiado</span>
            </>
          ) : (
            <>
              <Share2 className="w-3.5 h-3.5" aria-hidden="true" />
              <span>Compartir</span>
            </>
          )}
        </button>
      </div>

      {/* ======================================================== */}
      {/* HERO PANORÁMICO CINEMATOGRÁFICO (Inspirado en Spider-Man) */}
      {/* ======================================================== */}
      <section
        aria-label={`Ficha técnica destacada de ${game.title}`}
        className="relative rounded-3xl p-6 sm:p-8 md:p-12 overflow-hidden border border-frost-steel/80 dark:border-steam-steel/60 shadow-2xl min-h-[480px] flex flex-col justify-between"
      >
        {/* 1. Fondo Panorámico con Imagen de Escritorio (Banner / Hero) */}
        {bannerSource && !bannerError ? (
          <div className="absolute inset-0 z-0 overflow-hidden select-none">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={bannerSource}
              alt=""
              role="presentation"
              onError={() => setBannerError(true)}
              className="w-full h-full object-cover object-center filter brightness-[0.8] contrast-[1.05] transition-transform duration-700 ease-out hover:scale-[1.02]"
            />
          </div>
        ) : (
          <div className="absolute inset-0 z-0 bg-gradient-to-br from-steam-dark via-steam-navy to-[#0e1622]" />
        )}

        {/* 2. Capa de viñeta y degradado oscuro para contraste y legibilidad absoluta */}
        <div
          aria-hidden="true"
          className="absolute inset-0 z-0 bg-gradient-to-t from-black/95 via-black/70 to-black/35 sm:bg-gradient-to-r sm:from-black/95 sm:via-black/75 sm:to-black/30 pointer-events-none"
        />

        {/* 3. Contenido Principal del Hero */}
        <div className="relative z-10 grid grid-cols-1 lg:grid-cols-12 gap-8 items-start my-auto">
          {/* COLUMNA IZQUIERDA: Identidad del Juego, Sinopsis y Botón OPINAR */}
          <div className="lg:col-span-7 xl:col-span-8 flex flex-col gap-4 text-white">
            {/* Badges de Género y Fecha */}
            <div className="flex flex-wrap items-center gap-2">
              {game.genre && (
                <span className="inline-flex items-center px-3.5 py-1 rounded-full text-xs font-mono font-bold uppercase tracking-wider bg-sky-accent/25 text-sky-300 dark:text-steam-blue border border-sky-400/40 backdrop-blur-md shadow-sm">
                  {game.genre.name}
                </span>
              )}

              {game.releaseDate && (
                <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-mono bg-black/40 text-steam-light border border-white/20 backdrop-blur-md">
                  <Calendar className="w-3.5 h-3.5 text-steam-blue" aria-hidden="true" />
                  {formatReleaseDate(game.releaseDate)}
                </span>
              )}
            </div>

            {/* Título Monumental */}
            <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-black font-sans uppercase tracking-tight leading-tight text-white drop-shadow-[0_4px_16px_rgba(0,0,0,0.8)]">
              {game.title}
            </h1>

            {/* Sinopsis del Videojuego */}
            <p className="text-sm sm:text-base md:text-lg text-steam-light/95 leading-relaxed max-w-2xl drop-shadow-md">
              {game.description ||
                'No hay descripción técnica registrada para este título todavía.'}
            </p>

            {/* BOTÓN PRINCIPAL: OPINAR (En sustitución del Pre-order ficticio de la referencia) */}
            <div className="pt-3 flex flex-wrap items-center gap-4">
              <Link href={`/resenas/nueva?gameId=${game.id}`}>
                <Button
                  variant="primary"
                  size="lg"
                  className="px-8 py-3.5 text-base font-bold tracking-wide uppercase shadow-[0_0_25px_rgba(102,192,244,0.45)] hover:shadow-[0_0_35px_rgba(102,192,244,0.65)] transform hover:scale-[1.02] transition-all"
                  leftIcon={<SquarePen className="w-5 h-5" />}
                >
                  Opinar
                </Button>
              </Link>

              <button
                type="button"
                onClick={handleScrollToReviews}
                className="px-5 py-3 rounded-xl bg-white/10 hover:bg-white/15 border border-white/20 text-xs sm:text-sm font-mono text-white backdrop-blur-md transition-colors flex items-center gap-2"
              >
                <MessageSquareText className="w-4 h-4 text-steam-blue" />
                <span>Explorar opiniones ({reviews.length})</span>
              </button>
            </div>
          </div>

          {/* COLUMNA DERECHA: GAME REVIEWS (Puntuación Única GAUGE) y WATCH TRAILER */}
          <div className="lg:col-span-5 xl:col-span-4 flex flex-col gap-4 w-full">
            {/* 1. Bloque de Valoración Comunitaria con Anillo Circular */}
            <GameReviewScoreCard
              game={game}
              onScrollToReviews={handleScrollToReviews}
            />

            {/* 2. Bloque de Tráiler Oficial con Reproductor Modal */}
            <GameTrailerCard game={game} />
          </div>
        </div>

        {/* 4. Barra Inferior de Métricas Técnicas */}
        <div className="relative z-10 mt-6 pt-4 border-t border-white/15 grid grid-cols-2 sm:grid-cols-4 gap-3 text-white/90 text-xs font-mono">
          <div className="flex items-center gap-2">
            <Gamepad2 className="w-4 h-4 text-steam-blue" />
            <div>
              <span className="block text-[10px] text-steam-light/60 uppercase">Género</span>
              <strong className="text-white">{game.genre?.name || 'General'}</strong>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <Clock className="w-4 h-4 text-steam-blue" />
            <div>
              <span className="block text-[10px] text-steam-light/60 uppercase">Horas Reportadas</span>
              <strong className="text-white">{totalHoursReported} hrs</strong>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <Star className="w-4 h-4 text-amber-400 fill-amber-400" />
            <div>
              <span className="block text-[10px] text-steam-light/60 uppercase">Puntaje Medio</span>
              <strong className="text-white">{rating !== null ? `${rating.toFixed(1)} / 10` : 'S/C'}</strong>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <ShieldCheck className="w-4 h-4 text-emerald-400" />
            <div>
              <span className="block text-[10px] text-steam-light/60 uppercase">Comunidad GAUGE</span>
              <strong className="text-emerald-400">Verificada</strong>
            </div>
          </div>
        </div>
      </section>

      {/* ======================================================== */}
      {/* SECCIÓN DE RESEÑAS DE LA COMUNIDAD                       */}
      {/* ======================================================== */}
      <section
        id="resenas-comunidad"
        ref={reviewsSectionRef}
        aria-label="Reseñas de la comunidad"
        className="space-y-4 pt-2"
      >
        <div className="flex flex-wrap items-center justify-between gap-3">
          <div className="flex items-center gap-2.5">
            <div className="p-2.5 rounded-xl bg-white dark:bg-steam-navy border border-frost-steel dark:border-steam-steel/60 text-sky-accent dark:text-steam-blue shadow-sm">
              <MessageSquareText className="w-5 h-5" aria-hidden="true" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h2 className="text-lg sm:text-xl font-bold text-charcoal-text dark:text-pure-white font-sans uppercase">
                  Reseñas de la Comunidad
                </h2>
                <span className="text-xs px-2.5 py-0.5 rounded-full bg-sky-accent/15 dark:bg-steam-blue/20 text-sky-accent dark:text-steam-blue font-mono font-bold border border-sky-accent/30 dark:border-steam-blue/30">
                  {reviews.length} {reviews.length === 1 ? 'opinión' : 'opiniones'}
                </span>
              </div>
              <p className="text-xs text-active-slate/70 dark:text-steam-light/70 font-mono">
                Análisis fundamentados y horas de gameplay reportadas por jugadores reales
              </p>
            </div>
          </div>

          <Link href={`/resenas/nueva?gameId=${game.id}`}>
            <Button
              variant="primary"
              size="sm"
              leftIcon={<SquarePen className="w-3.5 h-3.5" />}
            >
              Opinar sobre {game.title}
            </Button>
          </Link>
        </div>

        {/* Grilla de Reseñas de la Comunidad */}
        {reviews.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {reviews.map((rev) => (
              <article
                key={rev.id}
                className="glass-panel rounded-2xl p-5 sm:p-6 border border-frost-steel dark:border-steam-steel/50 shadow-sm flex flex-col justify-between gap-4 hover:border-sky-accent/50 dark:hover:border-steam-blue/50 transition-all"
              >
                {/* Encabezado del Autor */}
                <div className="flex items-start justify-between gap-3">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-xl bg-sky-accent/15 dark:bg-steam-blue/20 border border-sky-accent/30 dark:border-steam-blue/30 flex items-center justify-center font-bold font-mono text-sm text-sky-accent dark:text-steam-blue">
                      {rev.user?.name ? rev.user.name.substring(0, 2).toUpperCase() : <User className="w-5 h-5" />}
                    </div>
                    <div>
                      <h3 className="font-bold text-sm text-charcoal-text dark:text-pure-white">
                        {rev.user?.name || 'Jugador de la Comunidad'}
                      </h3>
                      <div className="flex items-center gap-1.5 text-[11px] text-active-slate/70 dark:text-steam-light/60 font-mono">
                        <Clock className="w-3 h-3 text-sky-accent dark:text-steam-blue" aria-hidden="true" />
                        <span>{rev.hoursPlayed} hrs jugadas</span>
                      </div>
                    </div>
                  </div>

                  <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-xl bg-sky-accent/15 dark:bg-steam-blue/20 text-sky-accent dark:text-steam-blue font-mono font-bold text-sm border border-sky-accent/30 dark:border-steam-blue/30">
                    <Star className="w-3.5 h-3.5 fill-current" aria-hidden="true" />
                    <span>{rev.rating}</span>
                    <span className="text-[10px] font-normal opacity-70">/ 10</span>
                  </div>
                </div>

                {/* Contenido de la Reseña */}
                <p className="text-xs sm:text-sm text-active-slate dark:text-steam-light leading-relaxed italic">
                  “{rev.content}”
                </p>

                {/* Pie de la Reseña */}
                <div className="text-[10px] text-active-slate/60 dark:text-steam-light/50 font-mono pt-3 border-t border-frost-steel/40 dark:border-steam-steel/20 flex items-center justify-between">
                  <span>
                    {rev.createdAt
                      ? new Date(rev.createdAt).toLocaleDateString('es-ES', {
                          year: 'numeric',
                          month: 'long',
                          day: 'numeric',
                        })
                      : 'Fecha no registrada'}
                  </span>
                  <span className="inline-flex items-center gap-1 text-emerald-500 font-semibold">
                    <Check className="w-3 h-3" />
                    <span>Jugabilidad verificada</span>
                  </span>
                </div>
              </article>
            ))}
          </div>
        ) : (
          <div className="py-6">
            <EmptyState
              icon={<MessageSquareText className="w-8 h-8 opacity-80" />}
              title="Aún no hay reseñas para este juego"
              description="Sé el primer jugador en compartir tu experiencia técnica, horas de juego y valoración sobre este título."
              action={
                <Link href={`/resenas/nueva?gameId=${game.id}`}>
                  <Button
                    variant="primary"
                    size="md"
                    leftIcon={<SquarePen className="w-4 h-4" />}
                  >
                    Publicar primera reseña
                  </Button>
                </Link>
              }
            />
          </div>
        )}
      </section>
    </div>
  );
}

export default function GameDetailPage() {
  return (
    <AppShell showRightDock={false}>
      <Suspense
        fallback={
          <div className="flex flex-col gap-6 animate-pulse py-4">
            <div className="h-6 w-48 rounded-lg bg-frost-steel/40 dark:bg-steam-steel/30" />
            <div className="glass-panel rounded-3xl p-6 sm:p-10 border border-frost-steel dark:border-steam-steel/40 min-h-[460px] flex flex-col lg:flex-row gap-8">
              <div className="flex-1 space-y-4">
                <div className="h-12 w-3/4 rounded-xl bg-frost-steel/60 dark:bg-steam-steel/50" />
                <div className="h-28 w-full rounded-xl bg-frost-steel/30 dark:bg-steam-steel/20" />
              </div>
            </div>
          </div>
        }
      >
        <GameDetailContent />
      </Suspense>
    </AppShell>
  );
}
