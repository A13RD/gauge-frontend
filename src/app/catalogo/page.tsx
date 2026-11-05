import React from 'react';
import { AppShell } from '@/features/common/components/AppShell';
import { EmptyState } from '@/features/common/components/EmptyState';
import { Compass } from 'lucide-react';

export default function CatalogoPage() {
  return (
    <AppShell>
      <div className="py-8">
        <EmptyState
          icon={<Compass className="w-8 h-8" />}
          title="Catálogo de Videojuegos"
          description="La exploración de títulos, filtros dinámicos por género y paginación sincronizada con la API se implementarán en la Etapa 2."
        />
      </div>
    </AppShell>
  );
}

