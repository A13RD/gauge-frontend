import type { Metadata } from 'next';
import './globals.css';
import { ThemeProvider } from '@/features/common/hooks/useTheme';

export const metadata: Metadata = {
  title: 'GAUGE — Gaming Assessment & User Gameplay Evaluation',
  description:
    'Plataforma comunitaria para consultar videojuegos, publicar reseñas y visualizar estadísticas sobre la experiencia de los jugadores.',
  keywords: ['videojuegos', 'reseñas', 'gaming', 'evaluaciones', 'estadísticas de juego'],
  authors: [{ name: 'Equipo GAUGE' }],
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html
      lang="es"
      className="dark"
      suppressHydrationWarning
    >
      <head>
        <script
          dangerouslySetInnerHTML={{
            __html: `(function() {
              try {
                var stored = localStorage.getItem('gauge_theme');
                if (stored === 'light') {
                  document.documentElement.classList.remove('dark');
                  document.documentElement.classList.add('light');
                } else {
                  document.documentElement.classList.add('dark');
                  document.documentElement.classList.remove('light');
                }
              } catch (e) {}
            })();`,
          }}
        />
      </head>
      <body className="min-h-screen bg-gauge-bg text-gauge-text-primary antialiased selection:bg-steam-blue selection:text-steam-dark font-sans">
        <ThemeProvider>
          {children}
        </ThemeProvider>
      </body>
    </html>
  );
}
