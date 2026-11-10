'use client';

import React, { useState, useCallback, Suspense } from 'react';
import { Sidebar } from './Sidebar';
import { Topbar } from './Topbar';
import { MobileNav } from './MobileNav';
import { RightDock } from './RightDock';
import { useAuth } from '@/features/auth';

interface AppShellProps {
  children: React.ReactNode;
  rightDockContent?: React.ReactNode;
  showRightDock?: boolean;
}

export function AppShell({
  children,
  rightDockContent,
  showRightDock = true,
}: AppShellProps) {
  const { isAdmin } = useAuth();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isSidebarExpanded, setIsSidebarExpanded] = useState(false);

  const handleOpenMobileMenu = useCallback(() => {
    setIsMobileMenuOpen(true);
  }, []);

  const handleCloseMobileMenu = useCallback(() => {
    setIsMobileMenuOpen(false);
  }, []);

  const handleToggleSidebar = useCallback(() => {
    setIsSidebarExpanded((prev) => !prev);
  }, []);

  return (
    <div className="min-h-screen lg:h-screen lg:overflow-hidden bg-gauge-bg text-gauge-text-primary flex flex-col antialiased selection:bg-sky-accent dark:selection:bg-steam-blue selection:text-white dark:selection:text-steam-dark overflow-x-hidden">
      {/* Contenedor maestro con distribución de 3 zonas en escritorio */}
      <div className="flex-1 flex w-full max-w-[1700px] mx-auto p-2.5 sm:p-4 md:p-6 gap-4 lg:gap-6 relative lg:h-full lg:overflow-hidden">
        {/* ZONA 1: Sidebar de escritorio (Isla flotante FIJA en viewport) */}
        <Suspense fallback={<div className="hidden lg:block w-64 shrink-0 h-full" />}>
          <Sidebar
            isExpanded={isSidebarExpanded}
            onToggleExpanded={handleToggleSidebar}
            isAdmin={isAdmin}
          />
        </Suspense>

        {/* ZONA 2: Área central independiente (Scroll vertical exclusivo en escritorio) */}
        <div className="flex-1 flex flex-col min-w-0 lg:h-full lg:overflow-y-auto pr-0 lg:pr-2 scrollbar-thin">
          <Topbar onOpenMobileMenu={handleOpenMobileMenu} className="sticky top-0 z-20 shrink-0 mb-4 lg:mb-6" />

          <main className="flex-1 flex flex-col min-w-0 pb-24 lg:pb-6">
            {children}
          </main>
        </div>

        {/* ZONA 3: RightDock derecho (FIJO en viewport, no se estira con el scroll) */}
        {showRightDock && (
          <RightDock>
            {rightDockContent}
          </RightDock>
        )}
      </div>

      {/* Navegación Móvil (Barra inferior flotante fija + Drawer lateral) */}
      <Suspense fallback={null}>
        <MobileNav
          isOpen={isMobileMenuOpen}
          onClose={handleCloseMobileMenu}
          isAdmin={isAdmin}
        />
      </Suspense>
    </div>
  );
}
