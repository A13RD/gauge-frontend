'use client';

import React, { useState } from 'react';
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
  showRightDock = false,
}: AppShellProps) {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isSidebarExpanded, setIsSidebarExpanded] = useState(false);

  return (
    <div className="min-h-screen bg-gauge-bg text-gauge-text-primary flex flex-col antialiased selection:bg-steam-blue selection:text-steam-dark overflow-x-hidden">
      {/* Contenedor maestro con padding y gap responsivo */}
      <div className="flex-1 flex w-full max-w-[1600px] mx-auto p-3 sm:p-4 md:p-6 gap-4 lg:gap-6 relative">
        {/* 1. Sidebar de escritorio (Isla flotante) */}
        <Sidebar
          isExpanded={isSidebarExpanded}
          onToggleExpanded={() => setIsSidebarExpanded((prev) => !prev)}
        />

        {/* 2. Área central: Topbar + Main Content */}
        <div className="flex-1 flex flex-col min-w-0 gap-4 lg:gap-6">
          <Topbar onOpenMobileMenu={() => setIsMobileMenuOpen(true)} />

          <main className="flex-1 flex flex-col min-w-0 pb-20 lg:pb-0">
            {children}
          </main>
        </div>

        {/* 3. RightDock opcional (Pantallas XL+) */}
        {showRightDock && (
          <RightDock>
            {rightDockContent}
          </RightDock>
        )}
      </div>

      {/* 4. Navegación Móvil (Barra inferior flotante + Drawer lateral) */}
      <MobileNav
        isOpen={isMobileMenuOpen}
        onClose={() => setIsMobileMenuOpen(false)}
      />
    </div>
  );
}

