'use client';

import React from 'react';
import { AlertTriangle, RefreshCw } from 'lucide-react';
import { Button } from './Button';

export interface ErrorAlertProps {
  title?: string;
  message: string;
  statusCode?: number;
  onRetry?: () => void;
  className?: string;
}

export function ErrorAlert({
  title = 'Ha ocurrido un error',
  message,
  statusCode,
  onRetry,
  className = '',
}: ErrorAlertProps) {
  return (
    <div
      role="alert"
      className={`glass-panel rounded-2xl p-5 border-l-4 border-l-rose-500 border-steam-steel/40 dark:border-steam-steel/40 light:border-frost-steel shadow-lg ${className}`}
    >
      <div className="flex items-start gap-4">
        <div className="p-2.5 rounded-xl bg-rose-500/15 border border-rose-500/30 text-rose-400 shrink-0 mt-0.5">
          <AlertTriangle className="w-5 h-5" />
        </div>
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2 mb-1">
            <h4 className="font-semibold text-white light:text-charcoal-text text-base">
              {title}
            </h4>
            {statusCode && (
              <span className="text-xs px-2 py-0.5 rounded-md bg-rose-500/20 text-rose-300 font-mono font-medium">
                HTTP {statusCode}
              </span>
            )}
          </div>
          <p className="text-sm text-steam-light light:text-active-slate leading-relaxed">
            {message}
          </p>
          {onRetry && (
            <div className="mt-4">
              <Button
                variant="outline"
                size="sm"
                onClick={onRetry}
                leftIcon={<RefreshCw className="w-3.5 h-3.5" />}
              >
                Reintentar
              </Button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

