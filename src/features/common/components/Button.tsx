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
    sm: 'text-xs px-3 py-1.5 gap-1.5 rounded-lg',
    md: 'text-sm px-4 py-2 gap-2 rounded-xl',
    lg: 'text-base px-6 py-3 gap-2.5 rounded-xl',
  };

  const variantClasses: Record<ButtonVariant, string> = {
    primary:
      'bg-steam-blue text-steam-dark font-bold hover:bg-[#4199c9] hover:shadow-[0_0_16px_rgba(102,192,244,0.4)] border border-transparent dark:bg-steam-blue dark:text-steam-dark light:bg-deep-navy light:text-white light:hover:bg-active-slate',
    secondary:
      'bg-steam-steel/40 text-steam-light hover:text-white hover:bg-steam-steel/80 border border-steam-steel/70 light:bg-frost-bg light:text-charcoal-text light:border-frost-steel light:hover:bg-frost-steel/40',
    outline:
      'bg-transparent text-steam-light border border-steam-steel hover:border-steam-blue hover:text-steam-blue light:text-active-slate light:border-frost-steel light:hover:border-sky-accent light:hover:text-sky-accent',
    ghost:
      'bg-transparent text-steam-light hover:bg-steam-navy/50 hover:text-white border border-transparent light:text-active-slate light:hover:bg-frost-bg light:hover:text-charcoal-text',
  };

  const isDisabled = disabled || isLoading;

  return (
    <button
      disabled={isDisabled}
      aria-busy={isLoading}
      className={`inline-flex items-center justify-center font-medium transition-all duration-200 cursor-pointer focus:outline-none focus:ring-2 focus:ring-steam-blue focus:ring-offset-2 focus:ring-offset-steam-dark active:scale-[0.98] disabled:opacity-50 disabled:cursor-not-allowed disabled:active:scale-100 ${
        sizeClasses[size]
      } ${variantClasses[variant]} ${className}`}
      {...props}
    >
      {isLoading ? (
        <Loader2 className="w-4 h-4 animate-spin text-current" />
      ) : (
        leftIcon && <span className="inline-flex shrink-0">{leftIcon}</span>
      )}
      <span>{children}</span>
      {!isLoading && rightIcon && (
        <span className="inline-flex shrink-0">{rightIcon}</span>
      )}
    </button>
  );
}

