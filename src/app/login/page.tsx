'use client';

import React, { Suspense } from 'react';
import { AppShell } from '@/features/common/components/AppShell';
import { LoginForm, PublicOnlyRoute } from '@/features/auth';
import { Loader2 } from 'lucide-react';

export default function LoginPage() {
  return (
    <AppShell showRightDock={false}>
      <PublicOnlyRoute>
        <div className="py-6 sm:py-12 flex items-center justify-center min-h-[calc(100vh-160px)]">
          <Suspense
            fallback={
              <div className="flex justify-center items-center py-12">
                <Loader2 className="w-8 h-8 animate-spin text-sky-accent dark:text-steam-blue" />
              </div>
            }
          >
            <LoginForm />
          </Suspense>
        </div>
      </PublicOnlyRoute>
    </AppShell>
  );
}
