'use client';

import React from 'react';
import { Sun, Moon } from 'lucide-react';
import { useTheme } from '../hooks/useTheme';

interface ThemeToggleProps {
  className?: string;
}

export function ThemeToggle({ className = '' }: ThemeToggleProps) {
  const { theme, toggleTheme } = useTheme();
  const isDark = theme === 'dark';

  return (
    <button
      type="button"
      onClick={toggleTheme}
      aria-label={isDark ? 'Cambiar a modo claro' : 'Cambiar a modo oscuro'}
      title={isDark ? 'Activar Clean Frost Arcade (Modo Claro)' : 'Activar Steam Deep Cyberpunk (Modo Oscuro)'}
      className={`relative inline-flex items-center justify-center min-w-[42px] min-h-[42px] p-2 rounded-xl transition-all duration-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-sky-accent dark:focus-visible:ring-steam-blue focus-visible:ring-offset-2 ${
        isDark
          ? 'bg-steam-steel/40 text-steam-light hover:text-white hover:bg-steam-steel/70 border border-steam-steel/60'
          : 'bg-white text-active-slate hover:text-charcoal-text hover:bg-frost-bg border border-frost-steel shadow-sm'
      } ${className}`}
    >
      {isDark ? (
        <Sun className="w-5 h-5 text-steam-blue transition-transform duration-300 hover:rotate-45" aria-hidden="true" />
      ) : (
        <Moon className="w-5 h-5 text-sky-accent transition-transform duration-300 hover:-rotate-12" aria-hidden="true" />
      )}
    </button>
  );
}
