import React from 'react';
import Link from 'next/link';
import { AppShell } from '@/features/common/components/AppShell';
import { EmptyState } from '@/features/common/components/EmptyState';
import { Button } from '@/features/common/components/Button';
import { Lock, UserPlus } from 'lucide-react';

export default function LoginPage() {
  return (
    <AppShell>
      <div className="py-8">
        <EmptyState
          icon={<Lock className="w-8 h-8" />}
          title="Iniciar Sesión"
          description="El módulo de autenticación con validación de credenciales y gestión de JWT se implementará en la Etapa 2."
          action={
            <Link href="/register">
              <Button
                variant="outline"
                size="sm"
                leftIcon={<UserPlus className="w-4 h-4" />}
              >
                Crear una cuenta nueva
              </Button>
            </Link>
          }
        />
      </div>
    </AppShell>
  );
}

