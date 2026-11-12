'use client';

import React, { useState } from 'react';
import { Gauge as GaugeIcon } from 'lucide-react';

/**
 * Ruta oficial preparada para el logotipo original de GAUGE.
 * Cuando se incorpore el recurso original en `public/images/logo/gauge-logo.png`,
 * cambiar `GAUGE_LOGO_SRC` a `'/images/logo/gauge-logo.png'` (o el formato correspondiente)
 * para activarlo automáticamente en Sidebar, Topbar, MobileNav y pantallas de acceso.
 */
export const GAUGE_LOGO_SRC: string | null = null;

export interface BrandLogoProps {
  /** Tamaño del contenedor del isotipo ('sm' = 36px, 'md' = 40px, 'lg' = 48px) */
  size?: 'sm' | 'md' | 'lg';
  /** Mostrar el texto "GAUGE" junto al icono/logo */
  showText?: boolean;
  /** Subtítulo opcional debajo de GAUGE (ej. "Arcade Matrix" en Sidebar expandido) */
  subtitle?: string;
  /** Efecto de escala en hover cuando está dentro de un group interactivo */
  interactive?: boolean;
  className?: string;
}

const SIZE_CLASSES: Record<'sm' | 'md' | 'lg', { box: string; icon: string; text: string }> = {
  sm: {
    box: 'w-9 h-9 rounded-xl',
    icon: 'w-5 h-5',
    text: 'text-base',
  },
  md: {
    box: 'w-10 h-10 rounded-xl',
    icon: 'w-6 h-6',
    text: 'text-base',
  },
  lg: {
    box: 'w-12 h-12 rounded-2xl',
    icon: 'w-7 h-7',
    text: 'text-lg',
  },
};

export function BrandLogo({
  size = 'sm',
  showText = true,
  subtitle,
  interactive = true,
  className = '',
}: BrandLogoProps) {
  const [imageError, setImageError] = useState(false);
  const dimensions = SIZE_CLASSES[size];
  const hasCustomLogo = Boolean(GAUGE_LOGO_SRC) && !imageError;

  return (
    <div className={`flex items-center gap-2.5 min-w-0 ${className}`}>
      <div
        className={`${dimensions.box} bg-steam-blue/20 border border-steam-blue/40 flex items-center justify-center text-sky-accent dark:text-steam-blue shrink-0 overflow-hidden shadow-[0_0_12px_rgba(102,192,244,0.3)] ${
          interactive ? 'group-hover:scale-105 transition-transform' : ''
        }`}
      >
        {hasCustomLogo && GAUGE_LOGO_SRC ? (
          /* eslint-disable-next-line @next/next/no-img-element */
          <img
            src={GAUGE_LOGO_SRC}
            alt="Logotipo oficial de GAUGE"
            onError={() => setImageError(true)}
            className="w-full h-full object-contain p-1 select-none"
          />
        ) : (
          <GaugeIcon className={dimensions.icon} aria-hidden="true" />
        )}
      </div>

      {showText && (
        <div className="flex flex-col text-left overflow-hidden">
          <span
            className={`font-extrabold tracking-wider ${dimensions.text} text-charcoal-text dark:text-pure-white font-mono leading-tight`}
          >
            GAUGE
          </span>
          {subtitle && (
            <span className="text-[10px] text-active-slate/70 dark:text-steam-light/70 tracking-tight truncate">
              {subtitle}
            </span>
          )}
        </div>
      )}
    </div>
  );
}

