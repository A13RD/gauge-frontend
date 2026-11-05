import React from 'react';

export interface RightDockProps {
  children?: React.ReactNode;
  title?: string;
  className?: string;
}

export function RightDock({
  children,
  title = 'Centro de Control',
  className = '',
}: RightDockProps) {
  return (
    <aside
      aria-label="Panel lateral complementario"
      className={`hidden xl:flex flex-col w-72 shrink-0 z-20 ${className}`}
    >
      <div className="glass-panel h-full flex flex-col p-5 rounded-3xl border border-steam-steel/40 dark:border-steam-steel/40 light:border-frost-steel shadow-2xl transition-all">
        {/* Encabezado del Dock */}
        <div className="flex items-center justify-between pb-4 mb-4 border-b border-steam-steel/30 dark:border-steam-steel/30 light:border-frost-steel/50">
          <h2 className="text-sm font-bold uppercase tracking-wider text-white light:text-charcoal-text font-mono">
            {title}
          </h2>
          <span className="w-2 h-2 rounded-full bg-steam-blue light:bg-sky-accent animate-pulse shadow-[0_0_8px_rgba(102,192,244,0.8)]" />
        </div>

        {/* Contenido inyectado por composición */}
        <div className="flex-1 flex flex-col gap-4 overflow-y-auto">
          {children || (
            <div className="flex-1 flex flex-col items-center justify-center text-center p-4 border border-dashed border-steam-steel/30 dark:border-steam-steel/30 light:border-frost-steel/60 rounded-2xl">
              <span className="text-xs text-steam-light/60 light:text-active-slate/60 font-medium">
                Panel preparado para métricas y perfil de usuario
              </span>
            </div>
          )}
        </div>
      </div>
    </aside>
  );
}

