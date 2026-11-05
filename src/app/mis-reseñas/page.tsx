import React from 'react';
import { AppShell } from '@/features/common/components/AppShell';
import { EmptyState } from '@/features/common/components/EmptyState';
import { Star } from 'lucide-react';

export default function MisResenasPage() {
  return (
    <AppShell>
      <div className="py-8">
        <EmptyState
          icon={<Star className="w-8 h-8" />}
          title="Mis Reseñas"
          description="El historial de análisis y reseñas publicadas por el usuario autenticado se implementará en la Etapa 3."
        />
      </div>
    </AppShell>
  );
}

