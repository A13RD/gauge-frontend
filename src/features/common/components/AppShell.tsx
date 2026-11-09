'use client';

import React, { useState, useCallback } from 'react';
import { Sidebar } from './Sidebar';
import { Topbar } from './Topbar';
import { MobileNav } from './MobileNav';
import { RightDock } from './RightDock';

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
    <div className="min-h-screen bg-gauge-bg text-gauge-text-primary flex flex-col antialiased selection:bg-sky-accent dark:selection:bg-steam-blue selection:text-white dark:selection:text-steam-dark overflow-x-hidden">
      {/* Contenedor maestro con distribución de 3 zonas en escritorio */}
      <div className="flex-1 flex w-full max-w-[1700px] mx-auto p-2.5 sm:p-4 md:p-6 gap-4 lg:gap-6 relative">
        {/* ZONA 1: Sidebar de escritorio (Isla flotante) */}
        <Sidebar
          isExpanded={isSidebarExpanded}
          onToggleExpanded={handleToggleSidebar}
        />

        {/* ZONA 2: Área central (Topbar + Contenido principal) */}
        <div className="flex-1 flex flex-col min-w-0 gap-4 lg:gap-6">
          <Topbar onOpenMobileMenu={handleOpenMobileMenu} />

          <main className="flex-1 flex flex-col min-w-0 pb-24 lg:pb-0">
            {children}
          </main>
        </div>

        {/* ZONA 3: RightDock derecho (Escritorio ancho) */}
        {showRightDock && (
          <RightDock>
            {rightDockContent}
          </RightDock>
        )}
      </div>

      {/* Navegación Móvil (Barra inferior flotante fija + Drawer lateral) */}
      <MobileNav
        isOpen={isMobileMenuOpen}
        onClose={handleCloseMobileMenu}
      />
    </div>
  );
}
