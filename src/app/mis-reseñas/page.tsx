'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { AppShell } from '@/features/common/components/AppShell';
import { EmptyState } from '@/features/common/components/EmptyState';
import { Button } from '@/features/common/components/Button';
import { ErrorAlert } from '@/features/common/components/ErrorAlert';
import { ProtectedRoute } from '@/features/auth';
import { useMyReviews, Review } from '@/features/reviews';
import {
  MessageSquareText,
  SquarePen,
  Star,
  Clock,
  Calendar,
  Trash2,
  AlertTriangle,
  Gamepad2,
  ExternalLink,
} from 'lucide-react';

function ReviewCard({
  review,
  onDelete,
  isDeleting,
}: {
  review: Review;
  onDelete: (id: string) => Promise<void>;
  isDeleting: boolean;
}) {
  const [confirmDelete, setConfirmDelete] = useState(false);
  const [imgError, setImgError] = useState(false);

  const formattedDate = review.createdAt
    ? new Date(review.createdAt).toLocaleDateString('es-ES', {
        year: 'numeric',
        month: 'short',
        day: 'numeric',
      })
    : '';

  return (
    <div className="glass-panel rounded-2xl p-5 border border-frost-steel dark:border-steam-steel/50 shadow-md hover:shadow-xl transition-all duration-300 flex flex-col md:flex-row gap-5">
      {/* Portada del Videojuego */}
      <div className="w-full md:w-36 aspect-[3/4] rounded-xl overflow-hidden bg-frost-bg dark:bg-steam-dark/80 border border-frost-steel/60 dark:border-steam-steel/50 shrink-0 relative">
        {review.game?.coverUrl && !imgError ? (
          // eslint-disable-next-line @next/next/no-img-element
          <img
            src={review.game.coverUrl}
            alt={review.game.title || 'Portada'}
            onError={() => setImgError(true)}
            className="w-full h-full object-cover"
          />
        ) : (
          <div className="w-full h-full flex flex-col items-center justify-center p-3 text-center">
            <Gamepad2 className="w-8 h-8 text-active-slate/40 dark:text-steam-light/40 mb-1" aria-hidden="true" />
            <span className="text-[10px] font-mono text-active-slate/60 dark:text-steam-light/60">
              {review.game?.title || 'Videojuego'}
            </span>
          </div>
        )}
      </div>

      {/* Contenido de la Reseña */}
      <div className="flex-1 flex flex-col justify-between gap-4">
        <div className="space-y-2">
          <div className="flex flex-wrap items-center justify-between gap-2">
            <div className="flex items-center gap-2">
              <Link
                href={`/catalogo/${review.gameId}`}
                className="text-lg font-black text-charcoal-text dark:text-pure-white hover:text-sky-accent dark:hover:text-steam-blue transition-colors flex items-center gap-1.5"
              >
                {review.game?.title || 'Videojuego'}
                <ExternalLink className="w-3.5 h-3.5 opacity-60" aria-hidden="true" />
              </Link>
              {review.game?.genre && (
                <span className="text-[10px] font-mono font-bold uppercase tracking-wider px-2 py-0.5 rounded-md bg-frost-bg dark:bg-steam-steel/40 text-active-slate dark:text-steam-light border border-frost-steel dark:border-steam-steel/50">
                  {review.game.genre.name}
                </span>
              )}
            </div>

            <div className="flex items-center gap-2">
              <span className="inline-flex items-center gap-1 text-xs font-mono font-bold px-2.5 py-1 rounded-lg bg-sky-accent text-white dark:bg-steam-blue dark:text-steam-dark shadow-sm">
                <Star className="w-3.5 h-3.5 fill-current" aria-hidden="true" />
                {review.rating}/10
              </span>
            </div>
          </div>

          {/* Metadatos: Horas y Fecha */}
          <div className="flex items-center gap-4 text-xs font-mono text-active-slate/80 dark:text-steam-light/70">
            <span className="inline-flex items-center gap-1.5">
              <Clock className="w-3.5 h-3.5 text-sky-accent dark:text-steam-blue" aria-hidden="true" />
              {review.hoursPlayed}h jugadas
            </span>
            {formattedDate && (
              <span className="inline-flex items-center gap-1.5">
                <Calendar className="w-3.5 h-3.5 text-active-slate/60 dark:text-steam-light/60" aria-hidden="true" />
                {formattedDate}
              </span>
            )}
          </div>

          {/* Cuerpo del comentario */}
          <p className="text-sm text-charcoal-text/90 dark:text-steam-light leading-relaxed pt-1 whitespace-pre-line">
            {review.content}
          </p>
        </div>

        {/* Acciones de la tarjeta */}
        <div className="flex items-center justify-end pt-3 border-t border-frost-steel/60 dark:border-steam-steel/30">
          {confirmDelete ? (
            <div className="flex items-center gap-2">
              <span className="text-xs text-rose-500 dark:text-rose-400 font-medium">
                ¿Eliminar esta reseña?
              </span>
              <Button
                variant="outline"
                size="sm"
                onClick={() => setConfirmDelete(false)}
                disabled={isDeleting}
              >
                Cancelar
              </Button>
              <Button
                variant="danger"
                size="sm"
                isLoading={isDeleting}
                onClick={async () => {
                  await onDelete(review.id);
                  setConfirmDelete(false);
                }}
              >
                Sí, Eliminar
              </Button>
            </div>
          ) : (
            <button
              type="button"
              onClick={() => setConfirmDelete(true)}
              className="inline-flex items-center gap-1.5 text-xs text-active-slate/70 hover:text-rose-500 dark:text-steam-light/70 dark:hover:text-rose-400 transition-colors p-1"
            >
              <Trash2 className="w-3.5 h-3.5" aria-hidden="true" />
              Eliminar
            </button>
          )}
        </div>
      </div>
    </div>
  );
}

function MisResenasContent() {
  const { reviews, isLoading, error, statusCode, isDeleting, refetch, deleteReview } = useMyReviews();

  if (isLoading) {
    return (
      <div className="py-8 max-w-4xl mx-auto w-full space-y-4 animate-pulse">
        <div className="h-8 w-64 rounded-xl bg-frost-steel/40 dark:bg-steam-steel/30" />
        <div className="h-44 rounded-2xl bg-frost-steel/30 dark:bg-steam-steel/20" />
        <div className="h-44 rounded-2xl bg-frost-steel/30 dark:bg-steam-steel/20" />
      </div>
    );
  }

  if (error) {
    return (
      <div className="py-8 max-w-4xl mx-auto w-full space-y-4">
        <ErrorAlert
          title="Error al cargar tus reseñas"
          message={error}
          statusCode={statusCode || undefined}
          onRetry={refetch}
        />
      </div>
    );
  }

  if (reviews.length === 0) {
    return (
      <div className="py-8 max-w-4xl mx-auto w-full">
        <EmptyState
          icon={<MessageSquareText className="w-8 h-8 text-sky-accent dark:text-steam-blue" aria-hidden="true" />}
          title="Historial de Reseñas de Gameplay"
          description="Aún no has publicado reseñas en GAUGE. Registra tus títulos jugados, comparte tu análisis técnico y aporta horas de juego a la comunidad."
          action={
            <Link href="/resenas/nueva">
              <Button
                variant="primary"
                size="md"
                leftIcon={<SquarePen className="w-4 h-4" />}
              >
                Escribir mi primera reseña
              </Button>
            </Link>
          }
        />
      </div>
    );
  }

  return (
    <div className="py-6 sm:py-8 max-w-4xl mx-auto w-full space-y-6">
      {/* Cabecera de la sección */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 pb-2 border-b border-frost-steel dark:border-steam-steel/40">
        <div>
          <div className="inline-flex items-center gap-1.5 text-xs font-mono font-bold text-sky-accent dark:text-steam-blue mb-1">
            <MessageSquareText className="w-3.5 h-3.5" aria-hidden="true" />
            HISTORIAL DE JUGADOR
          </div>
          <h1 className="text-2xl sm:text-3xl font-black text-charcoal-text dark:text-pure-white font-sans">
            Mis Reseñas de Gameplay
          </h1>
          <p className="text-xs sm:text-sm text-active-slate dark:text-steam-light">
            Has publicado <strong className="text-charcoal-text dark:text-pure-white font-mono">{reviews.length}</strong> {reviews.length === 1 ? 'reseña' : 'reseñas'} técnicas en la plataforma.
          </p>
        </div>

        <Link href="/resenas/nueva">
          <Button
            variant="primary"
            size="md"
            leftIcon={<SquarePen className="w-4 h-4" />}
          >
            Nueva Reseña
          </Button>
        </Link>
      </div>

      {/* Listado de tarjetas de reseñas */}
      <div className="space-y-4">
        {reviews.map((rev) => (
          <ReviewCard
            key={rev.id}
            review={rev}
            onDelete={async (id) => {
              await deleteReview(id);
            }}
            isDeleting={isDeleting}
          />
        ))}
      </div>
    </div>
  );
}

export default function MisResenasPage() {
  return (
    <AppShell>
      <ProtectedRoute>
        <MisResenasContent />
      </ProtectedRoute>
    </AppShell>
  );
}
