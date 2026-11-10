'use client';

import React, { useEffect } from 'react';
import { useRouter, usePathname } from 'next/navigation';
import { useAuth } from '../hooks/useAuth';
import { ShieldAlert, ArrowLeft, Loader2 } from 'lucide-react';
import { Button } from '@/features/common/components/Button';

/**
 * Pantalla de carga neutra con glassmorphism para evitar flashes de contenido no autorizado
 */
function LoadingScreen() {
  return (
    <div className="flex flex-col items-center justify-center min-h-[50vh] gap-3 text-center">
      <div className="w-12 h-12 rounded-2xl bg-frost-steel/30 dark:bg-steam-steel/30 flex items-center justify-center text-sky-accent dark:text-steam-blue animate-pulse">
        <Loader2 className="w-6 h-6 animate-spin" aria-hidden="true" />
      </div>
      <p className="text-xs font-mono text-active-slate/70 dark:text-steam-light/60">
        Verificando credenciales de acceso...
      </p>
    </div>
  );
}

/**
 * Protector para rutas privadas que requieren inicio de sesión (ej. /mis-reseñas, /resenas/nueva)
 */
export function ProtectedRoute({ children }: { children: React.ReactNode }) {
  const { isAuthenticated, isLoading } = useAuth();
  const router = useRouter();
  const pathname = usePathname();

  useEffect(() => {
    if (!isLoading && !isAuthenticated) {
      const returnUrl = encodeURIComponent(pathname);
      router.replace(`/login?redirect=${returnUrl}`);
    }
  }, [isLoading, isAuthenticated, router, pathname]);

  if (isLoading) {
    return <LoadingScreen />;
  }

  if (!isAuthenticated) {
    return null;
  }

  return <>{children}</>;
}

/**
 * Protector para rutas de administración que requieren rol ADMIN (ej. /admin)
 */
export function AdminRoute({ children }: { children: React.ReactNode }) {
  const { isAuthenticated, isAdmin, isLoading } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (!isLoading && !isAuthenticated) {
      router.replace('/login?redirect=%2Fadmin');
    }
  }, [isLoading, isAuthenticated, router]);

  if (isLoading) {
    return <LoadingScreen />;
  }

  if (!isAuthenticated) {
    return null;
  }

  if (!isAdmin) {
    return (
      <div className="py-12 max-w-lg mx-auto w-full">
        <div className="glass-panel rounded-3xl p-8 sm:p-10 border border-rose-500/30 dark:border-rose-500/40 shadow-2xl flex flex-col items-center text-center gap-4">
          <div className="w-16 h-16 rounded-2xl bg-rose-500/15 border border-rose-500/30 flex items-center justify-center text-rose-500 dark:text-rose-400 shadow-inner">
            <ShieldAlert className="w-8 h-8" aria-hidden="true" />
          </div>
          <div className="space-y-1">
            <span className="text-xs font-mono font-bold uppercase text-rose-500 dark:text-rose-400 tracking-wider">
              Código HTTP 403 · Acceso Prohibido
            </span>
            <h2 className="text-xl sm:text-2xl font-black text-charcoal-text dark:text-pure-white font-sans uppercase">
              Permisos Administrativos Requeridos
            </h2>
            <p className="text-xs sm:text-sm text-active-slate dark:text-steam-light leading-relaxed">
              Tu cuenta tiene rol de usuario estándar. Las herramientas de gestión y moderación
              están reservadas exclusivamente para administradores.
            </p>
          </div>
          <div className="pt-2">
            <Button
              variant="outline"
              size="md"
              onClick={() => router.push('/')}
              leftIcon={<ArrowLeft className="w-4 h-4" />}
            >
              Volver a la Base
            </Button>
          </div>
        </div>
      </div>
    );
  }

  return <>{children}</>;
}

/**
 * Protector para rutas públicas exclusivas de invitados (ej. /login, /register)
 * Si el usuario ya tiene sesión activa, lo redirige al inicio
 */
export function PublicOnlyRoute({ children }: { children: React.ReactNode }) {
  const { isAuthenticated, isLoading } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (!isLoading && isAuthenticated) {
      router.replace('/');
    }
  }, [isLoading, isAuthenticated, router]);

  if (isLoading) {
    return <LoadingScreen />;
  }

  if (isAuthenticated) {
    return null;
  }

  return <>{children}</>;
}

