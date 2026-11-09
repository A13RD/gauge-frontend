import React from 'react';
import Link from 'next/link';
import { AppShell } from '@/features/common/components/AppShell';
import { Button } from '@/features/common/components/Button';
import { Gamepad2, Home, AlertCircle } from 'lucide-react';

export default function NotFound() {
  return (
    <AppShell>
      <div className="flex-1 flex flex-col items-center justify-center text-center py-12 px-4">
        <div className="glass-panel max-w-lg w-full rounded-3xl p-8 sm:p-12 border border-frost-steel dark:border-steam-steel/50 shadow-2xl flex flex-col items-center">
          {/* Badge de error 404 */}
          <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-xl bg-sky-accent/15 dark:bg-steam-blue/15 border border-sky-accent/30 dark:border-steam-blue/30 text-sky-accent dark:text-steam-blue text-xs font-mono font-semibold mb-6">
            <AlertCircle className="w-4 h-4" aria-hidden="true" />
            <span>ERROR 404 — SECTOR NO ENCONTRADO</span>
          </div>

          {/* Gráfico temático */}
          <div className="w-24 h-24 rounded-3xl bg-frost-bg dark:bg-steam-steel/20 border border-frost-steel dark:border-steam-steel/50 flex items-center justify-center text-sky-accent dark:text-steam-blue mb-6 shadow-inner">
            <Gamepad2 className="w-12 h-12 opacity-80" aria-hidden="true" />
          </div>

          <h1 className="text-2xl sm:text-3xl font-black text-charcoal-text dark:text-pure-white font-mono mb-3">
            ZONA DESCONECTADA
          </h1>

          <p className="text-sm sm:text-base text-active-slate dark:text-steam-light mb-8 max-w-sm leading-relaxed">
            La coordenada o recurso que estás intentando cargar no existe en la
            matriz de GAUGE o fue reubicada en otra partida.
          </p>

          <Link href="/">
            <Button
              variant="primary"
              size="md"
              leftIcon={<Home className="w-4 h-4" />}
            >
              Volver al Inicio
            </Button>
          </Link>
        </div>
      </div>
    </AppShell>
  );
}
