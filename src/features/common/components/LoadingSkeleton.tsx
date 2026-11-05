import React from 'react';

export interface LoadingSkeletonProps {
  className?: string;
  variant?: 'card' | 'text' | 'avatar' | 'custom';
  count?: number;
}

export function LoadingSkeleton({
  className = '',
  variant = 'custom',
  count = 1,
}: LoadingSkeletonProps) {
  const getVariantClasses = () => {
    switch (variant) {
      case 'card':
        return 'w-full h-64 rounded-2xl';
      case 'text':
        return 'w-full h-4 rounded-md';
      case 'avatar':
        return 'w-12 h-12 rounded-full shrink-0';
      case 'custom':
      default:
        return 'w-full h-full rounded-xl';
    }
  };

  const skeletons = Array.from({ length: count });

  return (
    <div
      role="status"
      aria-label="Cargando contenido"
      className="w-full flex flex-col gap-3"
    >
      {skeletons.map((_, index) => (
        <div
          key={index}
          className={`animate-pulse bg-steam-steel/25 border border-steam-steel/30 dark:bg-steam-steel/25 dark:border-steam-steel/30 light:bg-frost-steel/30 light:border-frost-steel/50 ${getVariantClasses()} ${className}`}
        />
      ))}
      <span className="sr-only">Cargando...</span>
    </div>
  );
}

