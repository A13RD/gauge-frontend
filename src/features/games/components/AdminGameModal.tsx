'use client';

import React, { useState, useEffect } from 'react';
import { Game, Genre } from '../domain/game.types';
import { gamesService } from '../services/games.service';
import { Button } from '@/features/common/components/Button';
import { HttpClientError } from '@/features/common/http';
import { X, Upload, Gamepad2, AlertTriangle, CheckCircle2 } from 'lucide-react';

export interface AdminGameModalProps {
  isOpen: boolean;
  gameToEdit: Game | null;
  genres: Genre[];
  onClose: () => void;
  onSuccess: () => void;
}

export function AdminGameModal({
  isOpen,
  gameToEdit,
  genres,
  onClose,
  onSuccess,
}: AdminGameModalProps) {
  const isEditing = !!gameToEdit;

  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [releaseDate, setReleaseDate] = useState('');
  const [genreId, setGenreId] = useState('');
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);

  useEffect(() => {
    if (gameToEdit) {
      setTitle(gameToEdit.title || '');
      setDescription(gameToEdit.description || '');
      setGenreId(gameToEdit.genreId || gameToEdit.genre?.id || '');
      if (gameToEdit.releaseDate) {
        const d = new Date(gameToEdit.releaseDate);
        if (!isNaN(d.getTime())) {
          setReleaseDate(d.toISOString().split('T')[0]);
        } else {
          setReleaseDate(gameToEdit.releaseDate.substring(0, 10));
        }
      } else {
        setReleaseDate('');
      }
      setPreviewUrl(gameToEdit.coverUrl || null);
      setSelectedFile(null);
    } else {
      setTitle('');
      setDescription('');
      setReleaseDate(new Date().toISOString().split('T')[0]);
      setGenreId(genres.length > 0 ? genres[0].id : '');
      setSelectedFile(null);
      setPreviewUrl(null);
    }
    setErrorMessage(null);
    setSuccessMessage(null);
  }, [gameToEdit, genres, isOpen]);

  if (!isOpen) return null;

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      if (!['image/png', 'image/jpeg', 'image/jpg', 'image/webp'].includes(file.type)) {
        setErrorMessage('Solo se admiten imágenes en formato PNG, JPEG o WebP.');
        return;
      }
      if (file.size > 5 * 1024 * 1024) {
        setErrorMessage('El tamaño de la imagen no debe superar los 5 MB.');
        return;
      }
      setSelectedFile(file);
      setPreviewUrl(URL.createObjectURL(file));
      setErrorMessage(null);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage(null);
    setSuccessMessage(null);

    if (!title || title.trim().length < 2) {
      setErrorMessage('El título debe tener al menos 2 caracteres.');
      return;
    }
    if (!description || description.trim().length < 10) {
      setErrorMessage('La descripción debe contener al menos 10 caracteres.');
      return;
    }
    if (!releaseDate) {
      setErrorMessage('La fecha de lanzamiento es obligatoria.');
      return;
    }
    if (!genreId) {
      setErrorMessage('Debes seleccionar un género para el videojuego.');
      return;
    }
    if (!isEditing && !selectedFile) {
      setErrorMessage('Es obligatorio adjuntar una carátula para crear un nuevo videojuego.');
      return;
    }

    setIsSubmitting(true);
    try {
      const formData = new FormData();
      formData.append('title', title.trim());
      formData.append('description', description.trim());
      formData.append('releaseDate', releaseDate);
      formData.append('genreId', genreId);

      if (selectedFile) {
        formData.append('image', selectedFile);
      }

      if (isEditing && gameToEdit) {
        await gamesService.updateGame(gameToEdit.id, formData);
        setSuccessMessage('Videojuego actualizado exitosamente.');
      } else {
        await gamesService.createGame(formData);
        setSuccessMessage('Videojuego creado exitosamente.');
      }

      setTimeout(() => {
        onSuccess();
        onClose();
      }, 1000);
    } catch (err: unknown) {
      if (err instanceof HttpClientError) {
        setErrorMessage(err.message);
      } else if (err instanceof Error) {
        setErrorMessage(err.message);
      } else {
        setErrorMessage('Error al procesar la solicitud en el servidor.');
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div
      role="dialog"
      aria-modal="true"
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm animate-fade-in overflow-y-auto"
    >
      <div className="relative w-full max-w-xl my-8 glass-panel rounded-3xl p-6 sm:p-8 border border-frost-steel dark:border-steam-steel/60 shadow-2xl bg-white dark:bg-steam-navy space-y-6">
        {/* Cabecera del Modal */}
        <div className="flex items-center justify-between pb-3 border-b border-frost-steel dark:border-steam-steel/40">
          <div className="flex items-center gap-2">
            <Gamepad2 className="w-5 h-5 text-sky-accent dark:text-steam-blue" aria-hidden="true" />
            <h3 className="text-lg font-bold font-sans text-charcoal-text dark:text-pure-white">
              {isEditing ? 'Editar Videojuego' : 'Registrar Nuevo Videojuego'}
            </h3>
          </div>
          <button
            type="button"
            onClick={onClose}
            disabled={isSubmitting}
            className="p-1.5 rounded-xl text-active-slate/70 hover:text-charcoal-text dark:text-steam-light/70 dark:hover:text-pure-white hover:bg-frost-bg dark:hover:bg-steam-steel/30 transition-colors"
            aria-label="Cerrar modal"
          >
            <X className="w-5 h-5" aria-hidden="true" />
          </button>
        </div>

        {/* Mensajes de feedback */}
        {successMessage && (
          <div className="p-3.5 rounded-2xl bg-emerald-500/15 border border-emerald-500/30 text-emerald-600 dark:text-emerald-400 text-xs flex items-center gap-2">
            <CheckCircle2 className="w-4 h-4 shrink-0" aria-hidden="true" />
            <span>{successMessage}</span>
          </div>
        )}

        {errorMessage && (
          <div className="p-3.5 rounded-2xl bg-rose-500/15 border border-rose-500/30 text-rose-600 dark:text-rose-400 text-xs flex items-center gap-2">
            <AlertTriangle className="w-4 h-4 shrink-0" aria-hidden="true" />
            <span>{errorMessage}</span>
          </div>
        )}

        {/* Formulario */}
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-xs font-mono font-bold uppercase tracking-wider text-charcoal-text dark:text-pure-white mb-1.5">
              Título del Videojuego *
            </label>
            <input
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              disabled={isSubmitting}
              placeholder="Ej. Hollow Knight: Silksong"
              className="w-full px-4 py-2.5 rounded-xl bg-frost-bg dark:bg-steam-dark/80 border border-frost-steel dark:border-steam-steel text-sm text-charcoal-text dark:text-pure-white focus:outline-none focus:border-sky-accent dark:focus:border-steam-blue transition-all"
            />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-mono font-bold uppercase tracking-wider text-charcoal-text dark:text-pure-white mb-1.5">
                Género *
              </label>
              <select
                value={genreId}
                onChange={(e) => setGenreId(e.target.value)}
                disabled={isSubmitting}
                className="w-full px-4 py-2.5 rounded-xl bg-frost-bg dark:bg-steam-dark/80 border border-frost-steel dark:border-steam-steel text-sm text-charcoal-text dark:text-pure-white focus:outline-none focus:border-sky-accent dark:focus:border-steam-blue transition-all"
              >
                <option value="" disabled>Selecciona un género...</option>
                {genres.map((g) => (
                  <option key={g.id} value={g.id}>
                    {g.name}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-xs font-mono font-bold uppercase tracking-wider text-charcoal-text dark:text-pure-white mb-1.5">
                Fecha de Lanzamiento *
              </label>
              <input
                type="date"
                value={releaseDate}
                onChange={(e) => setReleaseDate(e.target.value)}
                disabled={isSubmitting}
                className="w-full px-4 py-2.5 rounded-xl bg-frost-bg dark:bg-steam-dark/80 border border-frost-steel dark:border-steam-steel text-sm text-charcoal-text dark:text-pure-white focus:outline-none focus:border-sky-accent dark:focus:border-steam-blue transition-all"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-mono font-bold uppercase tracking-wider text-charcoal-text dark:text-pure-white mb-1.5">
              Descripción / Sinopsis *
            </label>
            <textarea
              rows={3}
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              disabled={isSubmitting}
              placeholder="Describe la propuesta jugable, ambientación y mecánicas principales..."
              className="w-full p-3 rounded-xl bg-frost-bg dark:bg-steam-dark/80 border border-frost-steel dark:border-steam-steel text-sm text-charcoal-text dark:text-pure-white focus:outline-none focus:border-sky-accent dark:focus:border-steam-blue transition-all resize-y"
            />
          </div>

          {/* Subida binaria de carátula */}
          <div>
            <label className="block text-xs font-mono font-bold uppercase tracking-wider text-charcoal-text dark:text-pure-white mb-1.5">
              Carátula Oficial {isEditing ? '(Opcional para actualizar)' : '*'}
            </label>
            <div className="flex items-center gap-4">
              <label className="flex-1 flex items-center justify-center gap-2 px-4 py-3 rounded-xl border border-dashed border-frost-steel dark:border-steam-steel/60 hover:border-sky-accent dark:hover:border-steam-blue bg-frost-bg/50 dark:bg-steam-dark/40 cursor-pointer transition-colors text-xs text-active-slate dark:text-steam-light font-medium">
                <Upload className="w-4 h-4 text-sky-accent dark:text-steam-blue" aria-hidden="true" />
                <span>{selectedFile ? selectedFile.name : 'Seleccionar archivo de imagen (PNG, JPEG, WebP)'}</span>
                <input
                  type="file"
                  accept="image/png,image/jpeg,image/webp"
                  onChange={handleFileChange}
                  disabled={isSubmitting}
                  className="hidden"
                />
              </label>

              {previewUrl && (
                <div className="w-14 h-14 rounded-xl overflow-hidden border border-frost-steel dark:border-steam-steel shrink-0 bg-frost-bg">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img src={previewUrl} alt="Preview" className="w-full h-full object-cover" />
                </div>
              )}
            </div>
            <p className="text-[11px] text-active-slate/70 dark:text-steam-light/60 mt-1 font-mono">
              La imagen se enviará mediante multipart/form-data a Supabase Storage.
            </p>
          </div>

          {/* Botones de acción */}
          <div className="flex items-center justify-end gap-3 pt-3 border-t border-frost-steel dark:border-steam-steel/40">
            <Button
              type="button"
              variant="outline"
              size="md"
              onClick={onClose}
              disabled={isSubmitting}
            >
              Cancelar
            </Button>
            <Button
              type="submit"
              variant="primary"
              size="md"
              isLoading={isSubmitting}
            >
              {isEditing ? 'Guardar Cambios' : 'Crear Videojuego'}
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
}

