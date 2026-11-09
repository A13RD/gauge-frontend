'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { AppShell } from '@/features/common/components/AppShell';
import { Button } from '@/features/common/components/Button';
import {
  SquarePen,
  Star,
  Clock,
  Gamepad2,
  Info,
  ChevronLeft,
} from 'lucide-react';

export default function NuevaResenaPage() {
  const [rating, setRating] = useState<number>(9);
  const [hours, setHours] = useState<string>('15');
  const [content, setContent] = useState<string>('');

  return (
    <AppShell>
      <div className="max-w-3xl mx-auto w-full py-4 sm:py-6 space-y-6">
        {/* Cabecera de la vista con botón de retorno */}
        <div className="flex items-center gap-3">
          <Link
            href="/"
            className="p-2 rounded-xl text-active-slate dark:text-steam-light hover:bg-frost-bg dark:hover:bg-steam-steel/40 border border-frost-steel dark:border-steam-steel/50 transition-colors"
            aria-label="Volver al inicio"
          >
            <ChevronLeft className="w-5 h-5" aria-hidden="true" />
          </Link>
          <div>
            <div className="inline-flex items-center gap-1.5 text-xs font-mono font-bold text-sky-accent dark:text-steam-blue mb-1">
              <SquarePen className="w-3.5 h-3.5" aria-hidden="true" />
              MÓDULO DE EVALUACIÓN
            </div>
            <h1 className="text-2xl sm:text-3xl font-black text-charcoal-text dark:text-pure-white font-sans">
              Publicar Nueva Reseña
            </h1>
          </div>
        </div>

        {/* Tarjeta Glassmorphic del Formulario */}
        <div className="glass-panel rounded-3xl p-6 sm:p-8 border border-frost-steel dark:border-steam-steel/50 shadow-2xl space-y-6">
          {/* 1. Selector de Videojuego */}
          <div className="space-y-2">
            <label
              htmlFor="game-select"
              className="block text-xs sm:text-sm font-bold text-charcoal-text dark:text-pure-white uppercase font-mono tracking-wider"
            >
              1. Videojuego a Evaluar
            </label>
            <div className="relative">
              <select
                id="game-select"
                className="w-full pl-10 pr-4 py-3 rounded-xl bg-white dark:bg-steam-dark/80 border border-frost-steel dark:border-steam-steel text-sm text-charcoal-text dark:text-pure-white focus-visible:outline-none focus-visible:border-sky-accent dark:focus-visible:border-steam-blue focus-visible:ring-1 focus-visible:ring-sky-accent dark:focus-visible:ring-steam-blue transition-all"
                defaultValue=""
              >
                <option value="" disabled>
                  Selecciona un videojuego del catálogo...
                </option>
                <option value="demo-1">Silent Hill 2 Remake</option>
                <option value="demo-2">Valorant</option>
                <option value="demo-3">Cyberpunk 2077</option>
                <option value="demo-4">Elden Ring</option>
              </select>
              <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-active-slate/60 dark:text-steam-light/60">
                <Gamepad2 className="w-4 h-4" aria-hidden="true" />
              </div>
            </div>
            <p className="text-[11px] text-active-slate/70 dark:text-steam-light/60">
              La sincronización dinámica desde el backend (`GET /api/games`) se habilitará en la siguiente etapa.
            </p>
          </div>

          {/* 2. Selector de Calificación (Escala 1 a 10) */}
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <label className="block text-xs sm:text-sm font-bold text-charcoal-text dark:text-pure-white uppercase font-mono tracking-wider">
                2. Calificación (Escala 1 — 10)
              </label>
              <span className="text-sm font-mono font-bold text-sky-accent dark:text-steam-blue px-2.5 py-0.5 rounded-lg bg-sky-accent/15 dark:bg-steam-blue/20">
                Nota: {rating}/10
              </span>
            </div>
            <div className="grid grid-cols-5 sm:grid-cols-10 gap-2">
              {[1, 2, 3, 4, 5, 6, 7, 8, 9, 10].map((num) => {
                const isSelected = rating === num;
                return (
                  <button
                    key={num}
                    type="button"
                    onClick={() => setRating(num)}
                    className={`py-2 rounded-xl font-mono font-bold text-sm transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-sky-accent dark:focus-visible:ring-steam-blue ${
                      isSelected
                        ? 'bg-deep-navy text-white dark:bg-steam-blue dark:text-steam-dark shadow-md scale-105'
                        : 'bg-white dark:bg-steam-steel/30 text-active-slate dark:text-steam-light border border-frost-steel dark:border-steam-steel/50 hover:bg-frost-bg dark:hover:bg-steam-steel/60'
                    }`}
                  >
                    {num}
                  </button>
                );
              })}
            </div>
          </div>

          {/* 3. Horas Jugadas */}
          <div className="space-y-2">
            <label
              htmlFor="hours-input"
              className="block text-xs sm:text-sm font-bold text-charcoal-text dark:text-pure-white uppercase font-mono tracking-wider"
            >
              3. Horas de Gameplay Dedicadas
            </label>
            <div className="relative">
              <input
                id="hours-input"
                type="number"
                min="0"
                step="1"
                value={hours}
                onChange={(e) => setHours(e.target.value)}
                placeholder="Ej. 24"
                className="w-full pl-10 pr-4 py-3 rounded-xl bg-white dark:bg-steam-dark/80 border border-frost-steel dark:border-steam-steel text-sm text-charcoal-text dark:text-pure-white placeholder-active-slate/50 dark:placeholder-steam-light/50 focus-visible:outline-none focus-visible:border-sky-accent dark:focus-visible:border-steam-blue focus-visible:ring-1 focus-visible:ring-sky-accent dark:focus-visible:ring-steam-blue transition-all"
              />
              <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-active-slate/60 dark:text-steam-light/60">
                <Clock className="w-4 h-4" aria-hidden="true" />
              </div>
            </div>
            <p className="text-[11px] text-active-slate/70 dark:text-steam-light/60">
              Registra el tiempo real dedicado para respaldar tu evaluación con métricas comunitarias.
            </p>
          </div>

          {/* 4. Comentario / Análisis Crítico */}
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <label
                htmlFor="content-input"
                className="block text-xs sm:text-sm font-bold text-charcoal-text dark:text-pure-white uppercase font-mono tracking-wider"
              >
                4. Análisis de Jugabilidad y Experiencia
              </label>
              <span className="text-[11px] text-active-slate/60 dark:text-steam-light/60 font-mono">
                {content.length} caracteres
              </span>
            </div>
            <textarea
              id="content-input"
              rows={5}
              value={content}
              onChange={(e) => setContent(e.target.value)}
              placeholder="Describe tu experiencia técnica: rendimiento, diseño de niveles, atmósfera sonora, dificultad y balance..."
              className="w-full p-4 rounded-xl bg-white dark:bg-steam-dark/80 border border-frost-steel dark:border-steam-steel text-sm text-charcoal-text dark:text-pure-white placeholder-active-slate/50 dark:placeholder-steam-light/50 focus-visible:outline-none focus-visible:border-sky-accent dark:focus-visible:border-steam-blue focus-visible:ring-1 focus-visible:ring-sky-accent dark:focus-visible:ring-steam-blue transition-all resize-y"
            />
          </div>

          {/* Aviso informativo de contrato */}
          <div className="p-4 rounded-2xl bg-frost-bg dark:bg-steam-steel/20 border border-frost-steel dark:border-steam-steel/40 flex items-start gap-3">
            <Info className="w-5 h-5 text-sky-accent dark:text-steam-blue shrink-0 mt-0.5" aria-hidden="true" />
            <div className="text-xs text-active-slate dark:text-steam-light leading-relaxed">
              <strong>Nota de integración:</strong> Este formulario refleja los parámetros exigidos
              por el contrato de API (`POST /api/reviews`). El envío hacia el servidor se activará
              en la siguiente etapa de desarrollo tras enlazar la sesión de usuario.
            </div>
          </div>

          {/* Botones de acción */}
          <div className="flex flex-wrap items-center justify-end gap-3 pt-3 border-t border-frost-steel/60 dark:border-steam-steel/30">
            <Link href="/">
              <Button variant="outline" size="md">
                Cancelar
              </Button>
            </Link>
            <Button
              variant="primary"
              size="md"
              leftIcon={<SquarePen className="w-4 h-4" />}
            >
              Publicar Reseña
            </Button>
          </div>
        </div>
      </div>
    </AppShell>
  );
}

