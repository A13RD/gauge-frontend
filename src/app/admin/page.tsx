'use client';

import React, { useState } from 'react';
import { AppShell } from '@/features/common/components/AppShell';
import { AdminRoute, useAuth, authService } from '@/features/auth';
import { Button } from '@/features/common/components/Button';
import {
  useGames,
  useGenres,
  gamesService,
  Game,
  AdminGameModal,
} from '@/features/games';
import { HttpClientError } from '@/features/common/http';
import {
  ShieldCheck,
  Server,
  CheckCircle2,
  AlertTriangle,
  KeyRound,
  Plus,
  Trash2,
  Edit3,
  Gamepad2,
  Tags,
  Calendar,
  Star,
  RefreshCw,
  X,
} from 'lucide-react';

function AdminContent() {
  const { user } = useAuth();

  // Gestión de videojuegos
  const {
    games,
    pagination,
    isLoading: isLoadingGames,
    error: gamesError,
    refetch: refetchGames,
  } = useGames({ limit: 50 });

  // Gestión de géneros
  const {
    genres,
    isLoading: isLoadingGenres,
    error: genresError,
    refetch: refetchGenres,
  } = useGenres();

  // Estados de Modal y Edición de Juegos
  const [isGameModalOpen, setIsGameModalOpen] = useState(false);
  const [gameToEdit, setGameToEdit] = useState<Game | null>(null);

  // Estados de Borrado de Videojuego
  const [gameToDelete, setGameToDelete] = useState<Game | null>(null);
  const [isDeletingGame, setIsDeletingGame] = useState(false);
  const [gameActionFeedback, setGameActionFeedback] = useState<{
    type: 'success' | 'error';
    message: string;
  } | null>(null);

  // Estados de Creación / Borrado de Géneros
  const [newGenreName, setNewGenreName] = useState('');
  const [newGenreSlug, setNewGenreSlug] = useState('');
  const [isCreatingGenre, setIsCreatingGenre] = useState(false);
  const [genreToDelete, setGenreToDelete] = useState<string | null>(null);
  const [isDeletingGenre, setIsDeletingGenre] = useState(false);
  const [genreFeedback, setGenreFeedback] = useState<{
    type: 'success' | 'error';
    message: string;
  } | null>(null);

  // Verificación de RBAC
  const [rbacTestStatus, setRbacTestStatus] = useState<string | null>(null);
  const [rbacError, setRbacError] = useState<string | null>(null);
  const [isTestingRbac, setIsTestingRbac] = useState(false);

  const testBackendRbac = async () => {
    setIsTestingRbac(true);
    setRbacTestStatus(null);
    setRbacError(null);

    try {
      const res = await authService.checkAdminAccess();
      setRbacTestStatus(res.message || 'Autorización confirmada por el backend.');
    } catch (err: unknown) {
      if (err instanceof HttpClientError) {
        setRbacError(`Error ${err.statusCode}: ${err.message}`);
      } else if (err instanceof Error) {
        setRbacError(err.message);
      } else {
        setRbacError('Error al contactar el endpoint administrativo');
      }
    } finally {
      setIsTestingRbac(false);
    }
  };

  // Abrir modal de creación
  const handleOpenCreateGame = () => {
    setGameToEdit(null);
    setIsGameModalOpen(true);
  };

  // Abrir modal de edición
  const handleOpenEditGame = (game: Game) => {
    setGameToEdit(game);
    setIsGameModalOpen(true);
  };

  // Confirmar y ejecutar eliminación de videojuego
  const handleDeleteGame = async () => {
    if (!gameToDelete) return;

    setIsDeletingGame(true);
    setGameActionFeedback(null);
    try {
      await gamesService.deleteGame(gameToDelete.id);
      setGameActionFeedback({
        type: 'success',
        message: `El videojuego "${gameToDelete.title}" fue eliminado correctamente.`,
      });
      setGameToDelete(null);
      await refetchGames();
    } catch (err: unknown) {
      if (err instanceof HttpClientError) {
        setGameActionFeedback({ type: 'error', message: err.message });
      } else if (err instanceof Error) {
        setGameActionFeedback({ type: 'error', message: err.message });
      } else {
        setGameActionFeedback({
          type: 'error',
          message: 'Error al eliminar el videojuego.',
        });
      }
    } finally {
      setIsDeletingGame(false);
    }
  };

  // Creación de nuevo género
  const handleCreateGenre = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newGenreName.trim()) {
      setGenreFeedback({
        type: 'error',
        message: 'El nombre del género es obligatorio.',
      });
      return;
    }

    setIsCreatingGenre(true);
    setGenreFeedback(null);
    try {
      await gamesService.createGenre({
        name: newGenreName.trim(),
        slug: newGenreSlug.trim() || undefined,
      });
      setGenreFeedback({
        type: 'success',
        message: `Género "${newGenreName.trim()}" creado exitosamente.`,
      });
      setNewGenreName('');
      setNewGenreSlug('');
      await refetchGenres();
    } catch (err: unknown) {
      if (err instanceof HttpClientError) {
        setGenreFeedback({ type: 'error', message: err.message });
      } else if (err instanceof Error) {
        setGenreFeedback({ type: 'error', message: err.message });
      } else {
        setGenreFeedback({
          type: 'error',
          message: 'No fue posible registrar el nuevo género.',
        });
      }
    } finally {
      setIsCreatingGenre(false);
    }
  };

  // Eliminación de género
  const handleDeleteGenre = async (id: string, name: string) => {
    setIsDeletingGenre(true);
    setGenreFeedback(null);
    try {
      await gamesService.deleteGenre(id);
      setGenreFeedback({
        type: 'success',
        message: `Género "${name}" eliminado exitosamente.`,
      });
      setGenreToDelete(null);
      await refetchGenres();
    } catch (err: unknown) {
      if (err instanceof HttpClientError) {
        setGenreFeedback({
          type: 'error',
          message:
            err.statusCode === 409
              ? `No se puede eliminar "${name}": tiene videojuegos asociados.`
              : err.message,
        });
      } else if (err instanceof Error) {
        setGenreFeedback({ type: 'error', message: err.message });
      } else {
        setGenreFeedback({
          type: 'error',
          message: `Error al eliminar el género "${name}".`,
        });
      }
    } finally {
      setIsDeletingGenre(false);
      setGenreToDelete(null);
    }
  };

  return (
    <div className="py-6 sm:py-8 space-y-8 max-w-6xl mx-auto w-full">
      {/* Cabecera Principal */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div className="space-y-1">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-mono font-bold bg-emerald-500/15 text-emerald-600 dark:text-emerald-400 border border-emerald-500/30">
            <ShieldCheck className="w-3.5 h-3.5" aria-hidden="true" />
            ZONA DE CONTROL ADMINISTRATIVO · ACCESO EXCLUSIVO
          </div>
          <h1 className="text-2xl sm:text-3xl font-black text-charcoal-text dark:text-pure-white font-sans uppercase">
            Panel de Administración
          </h1>
          <p className="text-xs sm:text-sm text-active-slate dark:text-steam-light">
            Sesión identificada con privilegios de rol{' '}
            <strong className="font-mono text-sky-accent dark:text-steam-blue">
              {user?.role}
            </strong>{' '}
            ({user?.email}).
          </p>
        </div>

        <Button
          variant="primary"
          size="md"
          onClick={handleOpenCreateGame}
          leftIcon={<Plus className="w-4 h-4" />}
        >
          Registrar Videojuego
        </Button>
      </div>

      {/* Tarjeta de estado de sesión administrativa y RBAC */}
      <div className="glass-panel rounded-3xl p-6 sm:p-7 border border-frost-steel dark:border-steam-steel/50 shadow-xl space-y-5">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 pb-4 border-b border-frost-steel dark:border-steam-steel/30">
          <div className="flex items-center gap-3">
            <div className="w-11 h-11 rounded-2xl bg-sky-accent/20 dark:bg-steam-blue/20 border border-sky-accent/40 dark:border-steam-blue/40 flex items-center justify-center text-sky-accent dark:text-steam-blue shadow-inner">
              <KeyRound className="w-5 h-5" aria-hidden="true" />
            </div>
            <div>
              <h3 className="font-bold text-base text-charcoal-text dark:text-pure-white">
                Administrador: {user?.name}
              </h3>
              <p className="text-xs text-active-slate/70 dark:text-steam-light/60 font-mono">
                ID: {user?.id}
              </p>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <Button
              variant="outline"
              size="sm"
              onClick={testBackendRbac}
              isLoading={isTestingRbac}
              leftIcon={<Server className="w-3.5 h-3.5" />}
            >
              Probar RBAC (`/api/auth/admin-only`)
            </Button>
            <div className="px-3 py-1.5 rounded-xl bg-sky-accent/15 dark:bg-steam-blue/20 text-sky-accent dark:text-steam-blue text-xs font-mono font-bold border border-sky-accent/30 dark:border-steam-blue/30">
              Rol: {user?.role}
            </div>
          </div>
        </div>

        {/* Feedback de RBAC */}
        {rbacTestStatus && (
          <div className="p-3.5 rounded-2xl bg-emerald-500/15 border border-emerald-500/30 text-emerald-600 dark:text-emerald-400 text-xs flex items-center gap-2">
            <CheckCircle2 className="w-4 h-4 shrink-0" aria-hidden="true" />
            <span>
              Respuesta del servidor: <strong>{rbacTestStatus}</strong>
            </span>
          </div>
        )}

        {rbacError && (
          <div className="p-3.5 rounded-2xl bg-rose-500/15 border border-rose-500/30 text-rose-600 dark:text-rose-400 text-xs flex items-center gap-2">
            <AlertTriangle className="w-4 h-4 shrink-0" aria-hidden="true" />
            <span>{rbacError}</span>
          </div>
        )}
      </div>

      {/* SECCIÓN 1: GESTIÓN DE VIDEOJUEGOS */}
      <section className="space-y-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="p-2 rounded-xl bg-sky-accent/15 dark:bg-steam-blue/15 text-sky-accent dark:text-steam-blue border border-sky-accent/30">
              <Gamepad2 className="w-5 h-5" aria-hidden="true" />
            </div>
            <div>
              <h2 className="text-xl font-bold font-sans text-charcoal-text dark:text-pure-white">
                Catálogo de Videojuegos
              </h2>
              <p className="text-xs text-active-slate dark:text-steam-light">
                {pagination ? `${pagination.total} videojuegos registrados` : 'Cargando listado...'}
              </p>
            </div>
          </div>

          <Button
            variant="outline"
            size="sm"
            onClick={() => refetchGames()}
            isLoading={isLoadingGames}
            leftIcon={<RefreshCw className="w-3.5 h-3.5" />}
          >
            Actualizar
          </Button>
        </div>

        {/* Feedback de acciones sobre videojuegos */}
        {gameActionFeedback && (
          <div
            className={`p-3.5 rounded-2xl text-xs flex items-center gap-2 ${
              gameActionFeedback.type === 'success'
                ? 'bg-emerald-500/15 border border-emerald-500/30 text-emerald-600 dark:text-emerald-400'
                : 'bg-rose-500/15 border border-rose-500/30 text-rose-600 dark:text-rose-400'
            }`}
          >
            {gameActionFeedback.type === 'success' ? (
              <CheckCircle2 className="w-4 h-4 shrink-0" aria-hidden="true" />
            ) : (
              <AlertTriangle className="w-4 h-4 shrink-0" aria-hidden="true" />
            )}
            <span>{gameActionFeedback.message}</span>
          </div>
        )}

        {/* Modal de confirmación de eliminación de videojuego */}
        {gameToDelete && (
          <div className="p-4 rounded-2xl bg-rose-500/10 border border-rose-500/30 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 animate-fade-in">
            <div className="flex items-center gap-3">
              <AlertTriangle className="w-5 h-5 text-rose-500 shrink-0" aria-hidden="true" />
              <div>
                <p className="text-xs font-bold text-rose-700 dark:text-rose-400">
                  ¿Confirmas que deseas eliminar &quot;{gameToDelete.title}&quot;?
                </p>
                <p className="text-[11px] text-active-slate/80 dark:text-steam-light/70">
                  Esta acción aplicará un borrado lógico y dejará el juego fuera del catálogo público.
                </p>
              </div>
            </div>
            <div className="flex items-center gap-2 shrink-0">
              <Button
                variant="outline"
                size="sm"
                onClick={() => setGameToDelete(null)}
                disabled={isDeletingGame}
              >
                Cancelar
              </Button>
              <Button
                variant="danger"
                size="sm"
                onClick={handleDeleteGame}
                isLoading={isDeletingGame}
                leftIcon={<Trash2 className="w-3.5 h-3.5" />}
              >
                Eliminar
              </Button>
            </div>
          </div>
        )}

        {/* Tabla / Tarjetas de Videojuegos */}
        {isLoadingGames ? (
          <div className="glass-panel rounded-3xl p-8 border border-frost-steel dark:border-steam-steel/50 flex flex-col items-center justify-center space-y-3">
            <div className="w-8 h-8 border-2 border-sky-accent border-t-transparent rounded-full animate-spin" />
            <p className="text-xs font-mono text-active-slate dark:text-steam-light">
              Consultando videojuegos desde el backend...
            </p>
          </div>
        ) : gamesError ? (
          <div className="glass-panel rounded-3xl p-6 border border-rose-500/30 text-rose-600 dark:text-rose-400 text-xs flex items-center justify-between gap-4">
            <div className="flex items-center gap-2">
              <AlertTriangle className="w-4 h-4 shrink-0" aria-hidden="true" />
              <span>{gamesError}</span>
            </div>
            <Button variant="outline" size="sm" onClick={() => refetchGames()}>
              Reintentar
            </Button>
          </div>
        ) : games.length === 0 ? (
          <div className="glass-panel rounded-3xl p-10 border border-frost-steel dark:border-steam-steel/50 text-center space-y-3">
            <Gamepad2 className="w-10 h-10 mx-auto text-active-slate/40 dark:text-steam-light/30" />
            <h3 className="font-bold text-sm text-charcoal-text dark:text-pure-white">
              No hay videojuegos registrados
            </h3>
            <p className="text-xs text-active-slate dark:text-steam-light max-w-sm mx-auto">
              Comienza registrando un videojuego con su título, descripción, género y carátula oficial.
            </p>
            <Button
              variant="primary"
              size="sm"
              onClick={handleOpenCreateGame}
              leftIcon={<Plus className="w-3.5 h-3.5" />}
            >
              Crear Primer Videojuego
            </Button>
          </div>
        ) : (
          <div className="glass-panel rounded-3xl border border-frost-steel dark:border-steam-steel/50 overflow-hidden shadow-xl">
            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="border-b border-frost-steel dark:border-steam-steel/30 bg-frost-bg/50 dark:bg-steam-steel/20 text-[11px] font-mono uppercase tracking-wider text-active-slate dark:text-steam-light">
                    <th className="py-3.5 px-4 font-bold">Carátula</th>
                    <th className="py-3.5 px-4 font-bold">Título</th>
                    <th className="py-3.5 px-4 font-bold">Género</th>
                    <th className="py-3.5 px-4 font-bold">Lanzamiento</th>
                    <th className="py-3.5 px-4 font-bold">Valoración</th>
                    <th className="py-3.5 px-4 font-bold text-right">Acciones</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-frost-steel/60 dark:divide-steam-steel/20 text-xs">
                  {games.map((game) => (
                    <tr
                      key={game.id}
                      className="hover:bg-frost-bg/40 dark:hover:bg-steam-steel/10 transition-colors"
                    >
                      <td className="py-3 px-4">
                        <div className="w-12 h-14 rounded-lg overflow-hidden border border-frost-steel dark:border-steam-steel bg-frost-bg/70 dark:bg-steam-dark/60 shrink-0">
                          {game.coverUrl ? (
                            /* eslint-disable-next-line @next/next/no-img-element */
                            <img
                              src={game.coverUrl}
                              alt={game.title}
                              className="w-full h-full object-cover"
                            />
                          ) : (
                            <div className="w-full h-full flex items-center justify-center text-active-slate/40">
                              <Gamepad2 className="w-5 h-5" />
                            </div>
                          )}
                        </div>
                      </td>
                      <td className="py-3 px-4">
                        <div className="font-bold text-charcoal-text dark:text-pure-white text-sm line-clamp-1">
                          {game.title}
                        </div>
                        <div className="text-[11px] text-active-slate/70 dark:text-steam-light/60 line-clamp-1 max-w-xs">
                          {game.description}
                        </div>
                      </td>
                      <td className="py-3 px-4">
                        <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-[11px] font-mono bg-sky-accent/15 dark:bg-steam-blue/20 text-sky-accent dark:text-steam-blue border border-sky-accent/30 dark:border-steam-blue/30 font-semibold">
                          {game.genre?.name || 'General'}
                        </span>
                      </td>
                      <td className="py-3 px-4 text-active-slate dark:text-steam-light font-mono text-[11px]">
                        <span className="inline-flex items-center gap-1">
                          <Calendar className="w-3 h-3 text-sky-accent dark:text-steam-blue" />
                          {game.releaseDate
                            ? new Date(game.releaseDate).toLocaleDateString()
                            : 'N/A'}
                        </span>
                      </td>
                      <td className="py-3 px-4">
                        <div className="inline-flex items-center gap-1 text-emerald-600 dark:text-emerald-400 font-mono font-bold">
                          <Star className="w-3 h-3 fill-emerald-500 text-emerald-500" />
                          <span>
                            {game.averageRating !== undefined && game.averageRating !== null
                              ? game.averageRating.toFixed(1)
                              : '0.0'}
                          </span>
                          <span className="text-[10px] text-active-slate/60 dark:text-steam-light/50 font-normal">
                            ({game.reviews?.length || 0})
                          </span>
                        </div>
                      </td>
                      <td className="py-3 px-4 text-right">
                        <div className="inline-flex items-center gap-1.5">
                          <Button
                            variant="secondary"
                            size="sm"
                            onClick={() => handleOpenEditGame(game)}
                            title="Editar videojuego"
                            leftIcon={<Edit3 className="w-3.5 h-3.5" />}
                          >
                            Editar
                          </Button>
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => setGameToDelete(game)}
                            title="Eliminar videojuego"
                            leftIcon={<Trash2 className="w-3.5 h-3.5 text-rose-500" />}
                          >
                            Eliminar
                          </Button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}
      </section>

      {/* SECCIÓN 2: GESTIÓN DE GÉNEROS */}
      <section className="space-y-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="p-2 rounded-xl bg-violet-accent/15 dark:bg-purple-500/15 text-violet-accent dark:text-purple-400 border border-violet-accent/30">
              <Tags className="w-5 h-5" aria-hidden="true" />
            </div>
            <div>
              <h2 className="text-xl font-bold font-sans text-charcoal-text dark:text-pure-white">
                Gestión de Géneros
              </h2>
              <p className="text-xs text-active-slate dark:text-steam-light">
                {genres.length} géneros disponibles en el catálogo
              </p>
            </div>
          </div>

          <Button
            variant="outline"
            size="sm"
            onClick={() => refetchGenres()}
            isLoading={isLoadingGenres}
            leftIcon={<RefreshCw className="w-3.5 h-3.5" />}
          >
            Actualizar
          </Button>
        </div>

        {/* Feedback de géneros */}
        {genreFeedback && (
          <div
            className={`p-3.5 rounded-2xl text-xs flex items-center gap-2 ${
              genreFeedback.type === 'success'
                ? 'bg-emerald-500/15 border border-emerald-500/30 text-emerald-600 dark:text-emerald-400'
                : 'bg-rose-500/15 border border-rose-500/30 text-rose-600 dark:text-rose-400'
            }`}
          >
            {genreFeedback.type === 'success' ? (
              <CheckCircle2 className="w-4 h-4 shrink-0" aria-hidden="true" />
            ) : (
              <AlertTriangle className="w-4 h-4 shrink-0" aria-hidden="true" />
            )}
            <span>{genreFeedback.message}</span>
          </div>
        )}

        {/* Formulario para registrar nuevo género */}
        <div className="glass-panel rounded-3xl p-5 border border-frost-steel dark:border-steam-steel/50 shadow-md">
          <form
            onSubmit={handleCreateGenre}
            className="flex flex-col sm:flex-row items-stretch sm:items-end gap-3"
          >
            <div className="flex-1">
              <label className="block text-[11px] font-mono font-bold uppercase tracking-wider text-charcoal-text dark:text-pure-white mb-1">
                Nombre del Género *
              </label>
              <input
                type="text"
                value={newGenreName}
                onChange={(e) => setNewGenreName(e.target.value)}
                disabled={isCreatingGenre}
                placeholder="Ej. Metroidvania, Roguelike, RPG..."
                className="w-full px-3.5 py-2 rounded-xl bg-frost-bg dark:bg-steam-dark/80 border border-frost-steel dark:border-steam-steel text-xs text-charcoal-text dark:text-pure-white focus:outline-none focus:border-violet-accent transition-all"
              />
            </div>

            <div className="w-full sm:w-48">
              <label className="block text-[11px] font-mono font-bold uppercase tracking-wider text-charcoal-text dark:text-pure-white mb-1">
                Slug (Opcional)
              </label>
              <input
                type="text"
                value={newGenreSlug}
                onChange={(e) => setNewGenreSlug(e.target.value)}
                disabled={isCreatingGenre}
                placeholder="Ej. roguelike"
                className="w-full px-3.5 py-2 rounded-xl bg-frost-bg dark:bg-steam-dark/80 border border-frost-steel dark:border-steam-steel text-xs text-charcoal-text dark:text-pure-white focus:outline-none focus:border-violet-accent transition-all font-mono"
              />
            </div>

            <Button
              type="submit"
              variant="primary"
              size="sm"
              isLoading={isCreatingGenre}
              leftIcon={<Plus className="w-3.5 h-3.5" />}
            >
              Crear Género
            </Button>
          </form>
        </div>

        {/* Listado de géneros actuales como chips con botón de eliminación */}
        <div className="glass-panel rounded-3xl p-5 border border-frost-steel dark:border-steam-steel/50 shadow-md space-y-3">
          <h4 className="text-xs font-mono font-bold uppercase tracking-wider text-charcoal-text dark:text-pure-white">
            Géneros Registrados en el Backend
          </h4>

          {isLoadingGenres ? (
            <p className="text-xs font-mono text-active-slate dark:text-steam-light">
              Cargando géneros...
            </p>
          ) : genresError ? (
            <p className="text-xs text-rose-500">{genresError}</p>
          ) : genres.length === 0 ? (
            <p className="text-xs text-active-slate dark:text-steam-light italic">
              No hay géneros creados. Crea el primero arriba.
            </p>
          ) : (
            <div className="flex flex-wrap gap-2 pt-1">
              {genres.map((genre) => (
                <div
                  key={genre.id}
                  className="inline-flex items-center gap-2 px-3 py-1.5 rounded-xl bg-frost-bg dark:bg-steam-steel/20 border border-frost-steel dark:border-steam-steel/40 text-xs text-charcoal-text dark:text-pure-white group"
                >
                  <span className="font-semibold">{genre.name}</span>
                  {genre.slug && (
                    <span className="text-[10px] font-mono text-active-slate/70 dark:text-steam-light/60">
                      ({genre.slug})
                    </span>
                  )}
                  <button
                    type="button"
                    onClick={() => {
                      if (genreToDelete === genre.id) {
                        handleDeleteGenre(genre.id, genre.name);
                      } else {
                        setGenreToDelete(genre.id);
                      }
                    }}
                    disabled={isDeletingGenre}
                    className={`p-1 rounded-lg transition-colors ${
                      genreToDelete === genre.id
                        ? 'bg-rose-500 text-white'
                        : 'text-active-slate/60 hover:text-rose-500 dark:text-steam-light/60 dark:hover:text-rose-400'
                    }`}
                    title={
                      genreToDelete === genre.id
                        ? 'Haz clic de nuevo para confirmar eliminación'
                        : `Eliminar ${genre.name}`
                    }
                  >
                    {genreToDelete === genre.id ? (
                      <span className="text-[10px] font-mono font-bold px-1">¿Eliminar?</span>
                    ) : (
                      <X className="w-3.5 h-3.5" aria-hidden="true" />
                    )}
                  </button>
                </div>
              ))}
            </div>
          )}
        </div>
      </section>

      {/* Modal para Crear / Editar Videojuego */}
      <AdminGameModal
        isOpen={isGameModalOpen}
        gameToEdit={gameToEdit}
        genres={genres}
        onClose={() => setIsGameModalOpen(false)}
        onSuccess={() => {
          refetchGames();
          setGameActionFeedback({
            type: 'success',
            message: gameToEdit
              ? 'Videojuego actualizado exitosamente.'
              : 'Nuevo videojuego registrado con éxito en el catálogo.',
          });
        }}
      />
    </div>
  );
}

export default function AdminPage() {
  return (
    <AppShell>
      <AdminRoute>
        <AdminContent />
      </AdminRoute>
    </AppShell>
  );
}
