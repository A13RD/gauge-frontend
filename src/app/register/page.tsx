import React from 'react';
import Link from 'next/link';
import { AppShell } from '@/features/common/components/AppShell';
import { EmptyState } from '@/features/common/components/EmptyState';
import { Button } from '@/features/common/components/Button';
import { UserPlus, Lock } from 'lucide-react';

export default function RegisterPage() {
  return (
    <AppShell>
      <div className="py-8">
        <EmptyState
          icon={<UserPlus className="w-8 h-8" />}
          title="Registro de Jugador"
          description="El formulario reactivo de creación de cuenta y verificación de seguridad se implementará en la Etapa 2."
          action={
            <Link href="/login">
              <Button
                variant="outline"
                size="sm"
                leftIcon={<Lock className="w-4 h-4" />}
              >
                ¿Ya tienes cuenta? Iniciar Sesión
              </Button>
            </Link>
          }
        />
      </div>
    </AppShell>
  );
}

