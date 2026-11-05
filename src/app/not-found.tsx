import React from 'react';
import Link from 'next/link';
import { AppShell } from '@/features/common/components/AppShell';
import { Button } from '@/features/common/components/Button';
import { Gamepad2, Home, AlertCircle } from 'lucide-react';

export default function NotFound() {
  return (
    <AppShell>
      <div className="flex-1 flex flex-col items-center justify-center text-center py-16 px-4">
        <div className="glass-panel max-w-lg w-full rounded-3xl p-8 sm:p-12 border border-steam-steel/40 dark:border-steam-steel/40 light:border-frost-steel shadow-2xl flex flex-col items-center">
          {/* Badge de error 404 */}
          <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-xl bg-steam-blue/15 border border-steam-blue/30 text-steam-blue light:text-sky-accent text-xs font-mono font-semibold mb-6">
            <AlertCircle className="w-4 h-4" />
            <span>ERROR 404 — SECTOR NO ENCONTRADO</span>
          </div>

          {/* Gráfico temático */}
          <div className="w-24 h-24 rounded-3xl bg-steam-steel/20 dark:bg-steam-steel/20 light:bg-frost-bg border border-steam-steel/50 dark:border-steam-steel/50 light:border-frost-steel flex items-center justify-center text-steam-blue light:text-sky-accent mb-6 shadow-inner">
            <Gamepad2 className="w-12 h-12 opacity-80" />
          </div>

          <h1 className="text-3xl sm:text-4xl font-black text-white light:text-charcoal-text font-mono mb-3">
            ZONA DESCONECTADA
          </h1>

          <p className="text-sm sm:text-base text-steam-light light:text-active-slate mb-8 max-w-sm leading-relaxed">
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

