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
      className={`glass-panel rounded-2xl p-8 sm:p-12 flex flex-col items-center justify-center text-center max-w-lg mx-auto ${className}`}
    >
      <div className="w-16 h-16 rounded-2xl bg-steam-steel/30 dark:bg-steam-steel/30 light:bg-frost-bg border border-steam-steel/50 dark:border-steam-steel/50 light:border-frost-steel flex items-center justify-center text-steam-blue light:text-sky-accent mb-4 shadow-inner">
        {icon || <PackageOpen className="w-8 h-8 opacity-80" />}
      </div>
      <h3 className="text-lg sm:text-xl font-bold text-white light:text-charcoal-text mb-2">
        {title}
      </h3>
      {description && (
        <p className="text-sm text-steam-light light:text-active-slate max-w-sm mb-6 leading-relaxed">
          {description}
        </p>
      )}
      {action && <div className="mt-2">{action}</div>}
    </div>
  );
}

