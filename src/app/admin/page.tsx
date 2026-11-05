import React from 'react';
import { AppShell } from '@/features/common/components/AppShell';
import { EmptyState } from '@/features/common/components/EmptyState';
import { Shield } from 'lucide-react';

export default function AdminPage() {
  return (
    <AppShell>
      <div className="py-8">
        <EmptyState
          icon={<Shield className="w-8 h-8" />}
          title="Panel de Administración"
          description="La gestión administrativa, creación de juegos con carga binaria multipart y borrado lógico se implementarán en la Etapa 4."
        />
      </div>
    </AppShell>
  );
}

