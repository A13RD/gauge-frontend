'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { useRouter, useSearchParams } from 'next/navigation';
import { useAuth } from '../hooks/useAuth';
import { LoginFormErrors } from '../domain/auth.types';
import { HttpClientError } from '@/features/common/http';
import { Button } from '@/features/common/components/Button';
import { ErrorAlert } from '@/features/common/components/ErrorAlert';
import {
  Mail,
  Lock,
  Eye,
  EyeOff,
  UserPlus,
  LogIn,
  AlertCircle,
  ShieldCheck,
} from 'lucide-react';

export function LoginForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { login } = useAuth();

  const isExpired = searchParams.get('expired') === 'true';
  const redirectUrl = searchParams.get('redirect') || '/';

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errors, setErrors] = useState<LoginFormErrors>({});

  const validate = (): boolean => {
    const newErrors: LoginFormErrors = {};

    const emailTrimmed = email.trim();
    if (!emailTrimmed) {
      newErrors.email = 'El correo electrónico es requerido';
    } else {
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!emailRegex.test(emailTrimmed)) {
        newErrors.email = 'Formato de correo electrónico inválido';
      }
    }

    if (!password) {
      newErrors.password = 'La contraseña es requerida';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validate()) return;

    setIsSubmitting(true);
    setErrors({});

    try {
      await login({
        email: email.trim(),
        password,
      });

      // Redirección segura tras autenticación exitosa
      router.push(redirectUrl.startsWith('/') ? redirectUrl : '/');
    } catch (err: unknown) {
      if (err instanceof HttpClientError) {
        if (err.statusCode === 401) {
          setErrors({ general: 'Credenciales inválidas. Verifica tu correo y contraseña.' });
        } else {
          setErrors({ general: err.message || 'Error al iniciar sesión en el servidor' });
        }
      } else if (err instanceof Error) {
        setErrors({ general: err.message });
      } else {
        setErrors({ general: 'Error inesperado durante la autenticación' });
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="w-full max-w-md mx-auto">
      <div className="glass-panel rounded-3xl p-6 sm:p-8 border border-frost-steel dark:border-steam-steel/50 shadow-2xl space-y-6">
        {/* Cabecera del Formulario */}
        <div className="text-center space-y-2">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-mono font-bold bg-sky-accent/15 dark:bg-steam-blue/20 text-sky-accent dark:text-steam-blue border border-sky-accent/30 dark:border-steam-blue/40">
            <ShieldCheck className="w-3.5 h-3.5" aria-hidden="true" />
            ACCESO AUTORIZADO · GAUGE
          </div>
          <h1 className="text-2xl sm:text-3xl font-black text-charcoal-text dark:text-pure-white font-sans uppercase">
            Iniciar Sesión
          </h1>
          <p className="text-xs sm:text-sm text-active-slate dark:text-steam-light">
            Ingresa a tu cuenta para sincronizar tus horas de gameplay y publicar reseñas.
          </p>
        </div>

        {/* Notificación de sesión expirada */}
        {isExpired && (
          <div className="p-3.5 rounded-2xl bg-amber-500/15 border border-amber-500/30 text-amber-600 dark:text-amber-400 text-xs flex items-center gap-2.5">
            <AlertCircle className="w-4 h-4 shrink-0" aria-hidden="true" />
            <span>Tu sesión previa ha expirado. Por favor, identifícate nuevamente.</span>
          </div>
        )}

        {/* Error general */}
        {errors.general && (
          <ErrorAlert
            title="Error de autenticación"
            message={errors.general}
          />
        )}

        {/* Formulario */}
        <form onSubmit={handleSubmit} className="space-y-4" noValidate>
          {/* Correo Electrónico */}
          <div className="space-y-1.5">
            <label
              htmlFor="login-email"
              className="block text-xs font-bold uppercase font-mono tracking-wider text-charcoal-text dark:text-pure-white"
            >
              Correo Electrónico
            </label>
            <div className="relative">
              <input
                id="login-email"
                type="email"
                autoComplete="email"
                value={email}
                onChange={(e) => {
                  setEmail(e.target.value);
                  if (errors.email) setErrors((prev) => ({ ...prev, email: undefined }));
                }}
                placeholder="ejemplo@gauge.com"
                className={`w-full pl-10 pr-4 py-2.5 text-sm rounded-xl bg-white dark:bg-steam-dark/80 border text-charcoal-text dark:text-pure-white placeholder-active-slate/50 dark:placeholder-steam-light/50 focus-visible:outline-none focus-visible:ring-2 transition-all ${
                  errors.email
                    ? 'border-rose-500 focus-visible:ring-rose-500'
                    : 'border-frost-steel dark:border-steam-steel focus-visible:border-sky-accent dark:focus-visible:border-steam-blue focus-visible:ring-sky-accent dark:focus-visible:ring-steam-blue'
                }`}
              />
              <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-active-slate/60 dark:text-steam-light/60">
                <Mail className="w-4 h-4" aria-hidden="true" />
              </div>
            </div>
            {errors.email && (
              <p className="text-[11px] font-mono text-rose-500 dark:text-rose-400">
                {errors.email}
              </p>
            )}
          </div>

          {/* Contraseña */}
          <div className="space-y-1.5">
            <div className="flex items-center justify-between">
              <label
                htmlFor="login-password"
                className="block text-xs font-bold uppercase font-mono tracking-wider text-charcoal-text dark:text-pure-white"
              >
                Contraseña
              </label>
            </div>
            <div className="relative">
              <input
                id="login-password"
                type={showPassword ? 'text' : 'password'}
                autoComplete="current-password"
                value={password}
                onChange={(e) => {
                  setPassword(e.target.value);
                  if (errors.password) setErrors((prev) => ({ ...prev, password: undefined }));
                }}
                placeholder="••••••••"
                className={`w-full pl-10 pr-11 py-2.5 text-sm rounded-xl bg-white dark:bg-steam-dark/80 border text-charcoal-text dark:text-pure-white placeholder-active-slate/50 dark:placeholder-steam-light/50 focus-visible:outline-none focus-visible:ring-2 transition-all ${
                  errors.password
                    ? 'border-rose-500 focus-visible:ring-rose-500'
                    : 'border-frost-steel dark:border-steam-steel focus-visible:border-sky-accent dark:focus-visible:border-steam-blue focus-visible:ring-sky-accent dark:focus-visible:ring-steam-blue'
                }`}
              />
              <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-active-slate/60 dark:text-steam-light/60">
                <Lock className="w-4 h-4" aria-hidden="true" />
              </div>
              <button
                type="button"
                onClick={() => setShowPassword((prev) => !prev)}
                aria-label={showPassword ? 'Ocultar contraseña' : 'Ver contraseña'}
                className="absolute inset-y-0 right-0 pr-3.5 flex items-center text-active-slate/60 dark:text-steam-light/60 hover:text-charcoal-text dark:hover:text-pure-white transition-colors cursor-pointer"
              >
                {showPassword ? (
                  <EyeOff className="w-4 h-4" aria-hidden="true" />
                ) : (
                  <Eye className="w-4 h-4" aria-hidden="true" />
                )}
              </button>
            </div>
            {errors.password && (
              <p className="text-[11px] font-mono text-rose-500 dark:text-rose-400">
                {errors.password}
              </p>
            )}
          </div>

          {/* Botón de Envío */}
          <div className="pt-2">
            <Button
              type="submit"
              variant="primary"
              size="lg"
              isLoading={isSubmitting}
              className="w-full"
              leftIcon={<LogIn className="w-4 h-4" />}
            >
              Acceder a GAUGE
            </Button>
          </div>
        </form>

        {/* Separador y enlace a registro */}
        <div className="pt-4 border-t border-frost-steel/60 dark:border-steam-steel/30 text-center">
          <p className="text-xs text-active-slate dark:text-steam-light">
            ¿Aún no tienes una cuenta de jugador?{' '}
            <Link
              href="/register"
              className="font-bold text-sky-accent dark:text-steam-blue hover:underline inline-flex items-center gap-1"
            >
              <span>Registrarse</span>
              <UserPlus className="w-3.5 h-3.5" aria-hidden="true" />
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}

