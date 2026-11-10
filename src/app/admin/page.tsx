'use client';

import React, { useState } from 'react';
import { AppShell } from '@/features/common/components/AppShell';
import { AdminRoute, useAuth, authService } from '@/features/auth';
import { Button } from '@/features/common/components/Button';
import { ShieldCheck, Server, CheckCircle2, AlertTriangle, KeyRound } from 'lucide-react';
import { HttpClientError } from '@/features/common/http';

function AdminContent() {
  const { user } = useAuth();
  const [rbacTestStatus, setRbacTestStatus] = useState<string | null>(null);
  const [rbacError, setRbacError] = useState<string | null>(null);
  const [isTesting, setIsTesting] = useState(false);

  const testBackendRbac = async () => {
    setIsTesting(true);
    setRbacTestStatus(null);
    setRbacError(null);

    try {
      const res = await authService.checkAdminAccess();
      setRbacTestStatus(res.message || 'Autorización confirmada por el backend');
    } catch (err: unknown) {
      if (err instanceof HttpClientError) {
        setRbacError(`Error ${err.statusCode}: ${err.message}`);
      } else if (err instanceof Error) {
        setRbacError(err.message);
      } else {
        setRbacError('Error al contactar el endpoint administrativo');
      }
    } finally {
      setIsTesting(false);
    }
  };

  return (
    <div className="py-6 sm:py-8 space-y-6 max-w-4xl mx-auto w-full">
      {/* Cabecera */}
      <div className="space-y-1">
        <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-mono font-bold bg-emerald-500/15 text-emerald-600 dark:text-emerald-400 border border-emerald-500/30">
          <ShieldCheck className="w-3.5 h-3.5" aria-hidden="true" />
          ZONA DE CONTROL ADMINISTRATIVO · ACCESO EXCLUSIVO
        </div>
        <h1 className="text-2xl sm:text-3xl font-black text-charcoal-text dark:text-pure-white font-sans uppercase">
          Panel de Administración
        </h1>
        <p className="text-xs sm:text-sm text-active-slate dark:text-steam-light">
          Sesión identificada con privilegios de rol <strong className="font-mono text-sky-accent dark:text-steam-blue">{user?.role}</strong> ({user?.email}).
        </p>
      </div>

      {/* Tarjeta de estado de sesión administrativa */}
      <div className="glass-panel rounded-3xl p-6 sm:p-8 border border-frost-steel dark:border-steam-steel/50 shadow-2xl space-y-5">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 pb-4 border-b border-frost-steel dark:border-steam-steel/30">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-2xl bg-sky-accent/20 dark:bg-steam-blue/20 border border-sky-accent/40 dark:border-steam-blue/40 flex items-center justify-center text-sky-accent dark:text-steam-blue shadow-inner">
              <KeyRound className="w-6 h-6" aria-hidden="true" />
            </div>
            <div>
              <h3 className="font-bold text-base text-charcoal-text dark:text-pure-white">
                Administrador: {user?.name}
              </h3>
              <p className="text-xs text-active-slate/70 dark:text-steam-light/60 font-mono">
                ID: {user?.id}
              </p>
            </div>
          </div>

          <div className="px-3 py-1.5 rounded-xl bg-sky-accent/15 dark:bg-steam-blue/20 text-sky-accent dark:text-steam-blue text-xs font-mono font-bold border border-sky-accent/30 dark:border-steam-blue/30">
            Rol Verificado: {user?.role}
          </div>
        </div>

        {/* Verificación de RBAC con el backend real */}
        <div className="space-y-3">
          <h4 className="text-xs font-mono font-bold uppercase tracking-wider text-charcoal-text dark:text-pure-white flex items-center gap-2">
            <Server className="w-4 h-4 text-sky-accent dark:text-steam-blue" aria-hidden="true" />
            Verificación de Seguridad RBAC en Servidor (`GET /api/auth/admin-only`)
          </h4>
          <p className="text-xs text-active-slate dark:text-steam-light leading-relaxed">
            Comprueba en tiempo real que el token JWT actual sea validado por el middleware de roles de Express
            (`roleMiddleware([&apos;ADMIN&apos;])`).
          </p>

          <Button
            variant="secondary"
            size="sm"
            onClick={testBackendRbac}
            isLoading={isTesting}
            leftIcon={<ShieldCheck className="w-3.5 h-3.5" />}
          >
            Verificar Permisos en Backend
          </Button>

          {rbacTestStatus && (
            <div className="p-3.5 rounded-2xl bg-emerald-500/15 border border-emerald-500/30 text-emerald-600 dark:text-emerald-400 text-xs flex items-center gap-2">
              <CheckCircle2 className="w-4 h-4 shrink-0" aria-hidden="true" />
              <span>Respuesta del servidor: <strong>{rbacTestStatus}</strong></span>
            </div>
          )}

          {rbacError && (
            <div className="p-3.5 rounded-2xl bg-rose-500/15 border border-rose-500/30 text-rose-600 dark:text-rose-400 text-xs flex items-center gap-2">
              <AlertTriangle className="w-4 h-4 shrink-0" aria-hidden="true" />
              <span>{rbacError}</span>
            </div>
          )}
        </div>

        {/* Aviso de etapas futuras */}
        <div className="p-4 rounded-2xl bg-frost-bg dark:bg-steam-steel/20 border border-frost-steel dark:border-steam-steel/40 text-xs text-active-slate dark:text-steam-light leading-relaxed">
          <strong>Etapas de desarrollo:</strong> La carga binaria multipart de videojuegos (`POST /api/games`)
          y el borrado lógico (`DELETE /api/games/:id`) se integrarán en las etapas correspondientes del catálogo.
        </div>
      </div>
    </div>
  );
}

export default function AdminPage() {
  return (
    <AppShell>
      <AdminRoute>
        <AdminContent />
      </AdminRoute>
    </AppShell>
  );
}
