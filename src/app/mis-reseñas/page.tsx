'use client';

import React from 'react';
import Link from 'next/link';
import { AppShell } from '@/features/common/components/AppShell';
import { EmptyState } from '@/features/common/components/EmptyState';
import { Button } from '@/features/common/components/Button';
import { ProtectedRoute } from '@/features/auth';
import { MessageSquareText, SquarePen } from 'lucide-react';

export default function MisResenasPage() {
  return (
    <AppShell>
      <ProtectedRoute>
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
      </ProtectedRoute>
    </AppShell>
  );
}
