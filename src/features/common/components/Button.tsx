'use client';

import React from 'react';
import { Loader2 } from 'lucide-react';

export type ButtonVariant = 'primary' | 'secondary' | 'outline' | 'ghost';
export type ButtonSize = 'sm' | 'md' | 'lg';

export interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: ButtonVariant;
  size?: ButtonSize;
  isLoading?: boolean;
  leftIcon?: React.ReactNode;
  rightIcon?: React.ReactNode;
}

export function Button({
  children,
  variant = 'primary',
  size = 'md',
  isLoading = false,
  leftIcon,
  rightIcon,
  disabled,
  className = '',
  ...props
}: ButtonProps) {
  const sizeClasses: Record<ButtonSize, string> = {
    sm: 'text-xs px-3 py-1.5 gap-1.5 rounded-lg min-h-[36px]',
    md: 'text-sm px-4 py-2 gap-2 rounded-xl min-h-[42px]',
    lg: 'text-base px-6 py-3 gap-2.5 rounded-xl min-h-[48px]',
  };

  const variantClasses: Record<ButtonVariant, string> = {
    primary:
      'bg-deep-navy text-white hover:bg-active-slate dark:bg-steam-blue dark:text-steam-dark font-bold dark:hover:bg-[#4199c9] dark:hover:shadow-[0_0_16px_rgba(102,192,244,0.4)] shadow-md border border-transparent transition-all',
    secondary:
      'bg-white text-charcoal-text border border-frost-steel hover:bg-frost-bg dark:bg-steam-steel/40 dark:text-steam-light dark:border-steam-steel/70 dark:hover:bg-steam-steel/80 dark:hover:text-white shadow-sm transition-all',
    outline:
      'bg-transparent text-active-slate border border-frost-steel hover:border-sky-accent hover:text-sky-accent dark:text-steam-light dark:border-steam-steel dark:hover:border-steam-blue dark:hover:text-steam-blue transition-all',
    ghost:
      'bg-transparent text-active-slate hover:bg-frost-steel/40 hover:text-charcoal-text dark:text-steam-light dark:hover:bg-steam-navy/60 dark:hover:text-white transition-all',
  };

  const isDisabled = disabled || isLoading;

  return (
    <button
      disabled={isDisabled}
      aria-busy={isLoading}
      className={`inline-flex items-center justify-center font-medium cursor-pointer focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-sky-accent dark:focus-visible:ring-steam-blue focus-visible:ring-offset-2 active:scale-[0.98] disabled:opacity-50 disabled:cursor-not-allowed disabled:active:scale-100 ${
        sizeClasses[size]
      } ${variantClasses[variant]} ${className}`}
      {...props}
    >
      {isLoading ? (
        <Loader2 className="w-4 h-4 animate-spin text-current" aria-hidden="true" />
      ) : (
        leftIcon && <span className="inline-flex shrink-0" aria-hidden="true">{leftIcon}</span>
      )}
      <span>{children}</span>
      {!isLoading && rightIcon && (
        <span className="inline-flex shrink-0" aria-hidden="true">{rightIcon}</span>
      )}
    </button>
  );
}
