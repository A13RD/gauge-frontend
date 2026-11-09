'use client';

import React, { Suspense, useState } from 'react';
import Link from 'next/link';
import { useParams, useRouter } from 'next/navigation';
import { AppShell } from '@/features/common/components/AppShell';
import { Button } from '@/features/common/components/Button';
import { useGameDetail } from '@/features/games/hooks/useGameDetail';
import {
  getGameRating,
  formatReleaseDate,
} from '@/features/games/domain/game.types';
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
} from 'lucide-react';
import { ErrorAlert } from '@/features/common/components/ErrorAlert';
import { EmptyState } from '@/features/common/components/EmptyState';

function GameDetailContent() {
  const params = useParams();
  const router = useRouter();
  const rawId = params?.id;
  const gameId = Array.isArray(rawId) ? rawId[0] : rawId || '';

  const { game, isLoading, error, statusCode, refetch } = useGameDetail(gameId);

  const [imgError, setImgError] = useState(false);
  const [bannerError, setBannerError] = useState(false);
  const [copied, setCopied] = useState(false);

  const handleCopyLink = () => {
    if (typeof window !== 'undefined') {
      navigator.clipboard.writeText(window.location.href);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  // 1. Estado de Carga
  if (isLoading) {
    return (
      <div className="flex flex-col gap-6 animate-pulse">
        {/* Skeleton de navegación */}
        <div className="h-6 w-48 rounded-lg bg-frost-steel/40 dark:bg-steam-steel/30" />

        {/* Skeleton Hero Cinematográfico */}
        <div className="glass-panel rounded-3xl p-6 sm:p-8 border border-frost-steel dark:border-steam-steel/40 min-h-[380px] flex flex-col md:flex-row gap-6">
          <div className="w-full md:w-64 aspect-[3/4] rounded-2xl bg-frost-steel/50 dark:bg-steam-steel/40 shrink-0" />
          <div className="flex-1 space-y-4">
            <div className="flex gap-2">
              <div className="h-6 w-24 rounded-full bg-frost-steel/40 dark:bg-steam-steel/30" />
              <div className="h-6 w-32 rounded-full bg-frost-steel/40 dark:bg-steam-steel/30" />
            </div>
            <div className="h-10 w-3/4 rounded-xl bg-frost-steel/60 dark:bg-steam-steel/50" />
            <div className="h-24 w-full rounded-xl bg-frost-steel/30 dark:bg-steam-steel/20" />
            <div className="h-10 w-48 rounded-xl bg-frost-steel/50 dark:bg-steam-steel/40" />
          </div>
        </div>

        {/* Skeleton de Reseñas */}
        <div className="space-y-4">
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

  // 3. Renderizado de la Ficha Técnica
  const rating = getGameRating(game);
  const reviews = Array.isArray(game.reviews) ? game.reviews : [];
  const bannerSource = game.bannerUrl || game.coverUrl;

  return (
    <div className="flex flex-col gap-6 sm:gap-8">
      {/* Breadcrumbs y Volver */}
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
      {/* HERO CINEMATOGRÁFICO DE LA FICHA TÉCNICA                 */}
      {/* ======================================================== */}
      <section
        aria-label={`Ficha técnica de ${game.title}`}
        className="relative glass-panel rounded-3xl p-6 sm:p-8 md:p-10 overflow-hidden border border-frost-steel dark:border-steam-steel/40 shadow-2xl"
      >
        {/* Fondo inmersivo con banner / cover blur */}
        {bannerSource && !bannerError && (
          <div className="absolute inset-0 z-0 overflow-hidden select-none">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={bannerSource}
              alt=""
              role="presentation"
              onError={() => setBannerError(true)}
              className="w-full h-full object-cover object-center filter blur-md scale-110 opacity-20 dark:opacity-15"
            />
          </div>
        )}

        {/* Degradado sobre el fondo */}
        <div
          aria-hidden="true"
          className="absolute inset-0 z-0 bg-gradient-to-r from-frost-bg/95 via-frost-bg/90 to-transparent dark:from-steam-navy/95 dark:via-steam-navy/90 dark:to-steam-dark/70 pointer-events-none"
        />

        <div className="relative z-10 flex flex-col md:flex-row items-start gap-6 sm:gap-8">
          {/* Portada en proporción 3:4 */}
          <div className="w-48 sm:w-56 md:w-64 aspect-[3/4] rounded-2xl overflow-hidden bg-frost-bg dark:bg-steam-dark/90 border-2 border-frost-steel dark:border-steam-steel/60 shadow-xl shrink-0 mx-auto md:mx-0 select-none">
            {game.coverUrl && !imgError ? (
              // eslint-disable-next-line @next/next/no-img-element
              <img
                src={game.coverUrl}
                alt={`Portada oficial de ${game.title}`}
                onError={() => setImgError(true)}
                className="w-full h-full object-cover"
              />
            ) : (
              <div className="w-full h-full flex flex-col items-center justify-center p-4 text-center">
                <Gamepad2 className="w-16 h-16 text-active-slate/40 dark:text-steam-light/30 mb-2" aria-hidden="true" />
                <span className="text-xs font-mono text-active-slate/70 dark:text-steam-light/60">
                  {game.title}
                </span>
              </div>
            )}
          </div>

          {/* Metadatos y Datos Principales */}
          <div className="flex-1 flex flex-col justify-between gap-4">
            <div className="space-y-3">
              {/* Badges de Género y Lanzamiento */}
              <div className="flex flex-wrap items-center gap-2">
                {game.genre && (
                  <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-mono font-bold uppercase tracking-wider bg-sky-accent/15 dark:bg-steam-blue/20 text-sky-accent dark:text-steam-blue border border-sky-accent/30 dark:border-steam-blue/40 shadow-xs">
                    {game.genre.name}
                  </span>
                )}

                {game.releaseDate && (
                  <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-mono bg-white/80 dark:bg-steam-steel/40 text-charcoal-text dark:text-pure-white border border-frost-steel dark:border-steam-steel/50">
                    <Calendar className="w-3.5 h-3.5" aria-hidden="true" />
                    {formatReleaseDate(game.releaseDate)}
                  </span>
                )}
              </div>

              {/* Título */}
              <h1 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-black text-charcoal-text dark:text-pure-white font-sans uppercase tracking-tight leading-tight">
                {game.title}
              </h1>

              {/* Puntuación Media */}
              <div className="flex items-center gap-3 pt-1">
                <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-2xl bg-white dark:bg-steam-dark border border-frost-steel dark:border-steam-steel/60 shadow-md">
                  <Star className="w-4 h-4 text-amber-500 fill-amber-500" aria-hidden="true" />
                  <span className="text-base sm:text-lg font-mono font-black text-charcoal-text dark:text-pure-white">
                    {rating !== null ? `${rating.toFixed(1)}` : 'S/C'}
                  </span>
                  <span className="text-xs font-mono text-active-slate/70 dark:text-steam-light/60 border-l border-frost-steel dark:border-steam-steel pl-2">
                    {reviews.length} {reviews.length === 1 ? 'reseña' : 'reseñas'}
                  </span>
                </div>
              </div>

              {/* Sinopsis / Descripción */}
              <div className="pt-2">
                <h2 className="text-xs font-mono font-bold uppercase tracking-wider text-active-slate/80 dark:text-steam-light/70 mb-1.5">
                  Sinopsis y Análisis Técnico
                </h2>
                <p className="text-xs sm:text-sm md:text-base text-active-slate dark:text-steam-light leading-relaxed">
                  {game.description ||
                    'No hay descripción técnica registrada para este título todavía.'}
                </p>
              </div>
            </div>

            {/* Botón CTA para Publicar Reseña */}
            <div className="pt-4 border-t border-frost-steel/60 dark:border-steam-steel/30 flex flex-wrap items-center gap-3">
              <Link href={`/resenas/nueva?gameId=${game.id}`}>
                <Button
                  variant="primary"
                  size="md"
                  leftIcon={<SquarePen className="w-4 h-4" />}
                >
                  Publicar Reseña para este juego
                </Button>
              </Link>
              <Link href="/catalogo">
                <Button
                  variant="outline"
                  size="md"
                  leftIcon={<Compass className="w-4 h-4" />}
                >
                  Explorar más juegos
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* ======================================================== */}
      {/* SECCIÓN DE RESEÑAS DE LA COMUNIDAD                       */}
      {/* ======================================================== */}
      <section aria-label="Reseñas de la comunidad" className="space-y-4">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <div className="flex items-center gap-2.5">
            <div className="p-2 rounded-xl bg-white dark:bg-steam-navy border border-frost-steel dark:border-steam-steel/60 text-sky-accent dark:text-steam-blue shadow-sm">
              <MessageSquareText className="w-5 h-5" aria-hidden="true" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h2 className="text-base sm:text-lg font-bold text-charcoal-text dark:text-pure-white font-mono uppercase">
                  Reseñas de la Comunidad
                </h2>
                <span className="text-xs px-2 py-0.5 rounded-full bg-sky-accent/15 dark:bg-steam-blue/20 text-sky-accent dark:text-steam-blue font-mono font-bold">
                  {reviews.length}
                </span>
              </div>
              <p className="text-xs text-active-slate/70 dark:text-steam-light/70">
                Evaluaciones fundamentadas y horas de gameplay reportadas
              </p>
            </div>
          </div>

          <Link href={`/resenas/nueva?gameId=${game.id}`}>
            <Button
              variant="secondary"
              size="sm"
              leftIcon={<SquarePen className="w-3.5 h-3.5" />}
            >
              Escribir Reseña
            </Button>
          </Link>
        </div>

        {/* Grilla o Lista de Reseñas */}
        {reviews.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {reviews.map((rev) => (
              <article
                key={rev.id}
                className="glass-panel rounded-2xl p-5 border border-frost-steel dark:border-steam-steel/50 shadow-sm flex flex-col justify-between gap-4"
              >
                {/* Encabezado de la Reseña */}
                <div className="flex items-start justify-between gap-3">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-xl bg-frost-steel/40 dark:bg-steam-steel/40 flex items-center justify-center font-bold font-mono text-sm text-charcoal-text dark:text-pure-white">
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

                    <div className="inline-flex items-center gap-1 px-2.5 py-1 rounded-xl bg-sky-accent/15 dark:bg-steam-blue/20 text-sky-accent dark:text-steam-blue font-mono font-bold text-sm">
                      <Star className="w-3.5 h-3.5 fill-current" aria-hidden="true" />
                      <span>{rev.rating}</span>
                    </div>
                </div>

                {/* Cuerpo del comentario */}
                <p className="text-xs sm:text-sm text-active-slate dark:text-steam-light leading-relaxed">
                  “{rev.content}”
                </p>

                {/* Fecha de Publicación */}
                <div className="text-[10px] text-active-slate/60 dark:text-steam-light/50 font-mono pt-2 border-t border-frost-steel/40 dark:border-steam-steel/20 flex justify-between">
                  <span>
                    {rev.createdAt
                      ? new Date(rev.createdAt).toLocaleDateString('es-ES', {
                          year: 'numeric',
                          month: 'long',
                          day: 'numeric',
                        })
                      : 'Fecha no registrada'}
                  </span>
                  <span className="text-emerald-500 font-semibold">Jugabilidad verificada</span>
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
                    size="sm"
                    leftIcon={<SquarePen className="w-3.5 h-3.5" />}
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
    <AppShell>
      <Suspense
        fallback={
          <div className="flex flex-col gap-6 animate-pulse py-4">
            <div className="h-6 w-48 rounded-lg bg-frost-steel/40 dark:bg-steam-steel/30" />
            <div className="glass-panel rounded-3xl p-6 sm:p-8 border border-frost-steel dark:border-steam-steel/40 min-h-[380px] flex flex-col md:flex-row gap-6">
              <div className="w-full md:w-64 aspect-[3/4] rounded-2xl bg-frost-steel/50 dark:bg-steam-steel/40 shrink-0" />
              <div className="flex-1 space-y-4">
                <div className="h-10 w-3/4 rounded-xl bg-frost-steel/60 dark:bg-steam-steel/50" />
                <div className="h-24 w-full rounded-xl bg-frost-steel/30 dark:bg-steam-steel/20" />
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
