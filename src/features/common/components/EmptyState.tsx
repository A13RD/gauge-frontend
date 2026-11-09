import React from 'react';
import { PackageOpen } from 'lucide-react';

export interface EmptyStateProps {
  title: string;
  description?: string;
  icon?: React.ReactNode;
  action?: React.ReactNode;
  className?: string;
}

export function EmptyState({
  title,
  description,
  icon,
  action,
  className = '',
}: EmptyStateProps) {
  return (
    <div
      className={`glass-panel rounded-3xl p-8 sm:p-12 border border-frost-steel dark:border-steam-steel/50 shadow-2xl flex flex-col items-center justify-center text-center max-w-lg mx-auto ${className}`}
    >
      <div className="w-16 h-16 rounded-2xl bg-frost-bg dark:bg-steam-steel/30 border border-frost-steel dark:border-steam-steel/50 flex items-center justify-center text-sky-accent dark:text-steam-blue mb-4 shadow-inner">
        {icon || <PackageOpen className="w-8 h-8 opacity-80" aria-hidden="true" />}
      </div>
      <h3 className="text-lg sm:text-xl font-bold text-charcoal-text dark:text-pure-white mb-2 font-mono">
        {title}
      </h3>
      {description && (
        <p className="text-sm text-active-slate dark:text-steam-light max-w-sm mb-6 leading-relaxed">
          {description}
        </p>
      )}
      {action && <div className="mt-2">{action}</div>}
    </div>
  );
}
