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
          className={`animate-pulse bg-frost-steel/40 border border-frost-steel/60 dark:bg-steam-steel/25 dark:border-steam-steel/30 ${getVariantClasses()} ${className}`}
        />
      ))}
      <span className="sr-only">Cargando...</span>
    </div>
  );
}
