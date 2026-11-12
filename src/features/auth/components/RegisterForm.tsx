'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useAuth } from '../hooks/useAuth';
import { RegisterFormErrors } from '../domain/auth.types';
import { HttpClientError } from '@/features/common/http';
import { Button } from '@/features/common/components/Button';
import { ErrorAlert } from '@/features/common/components/ErrorAlert';
import { BrandLogo } from '@/features/common/components/BrandLogo';
import {
  User as UserIcon,
  Mail,
  Lock,
  Eye,
  EyeOff,
  UserPlus,
  LogIn,
  CheckCircle2,
} from 'lucide-react';

export function RegisterForm() {
  const router = useRouter();
  const { register } = useAuth();

  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errors, setErrors] = useState<RegisterFormErrors>({});

  const validate = (): boolean => {
    const newErrors: RegisterFormErrors = {};

    const trimmedName = name.trim();
    if (!trimmedName) {
      newErrors.name = 'El nombre de jugador es obligatorio';
    } else if (trimmedName.length < 2) {
      newErrors.name = 'El nombre debe tener al menos 2 caracteres';
    }

    const trimmedEmail = email.trim();
    if (!trimmedEmail) {
      newErrors.email = 'El correo electrónico es obligatorio';
    } else {
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!emailRegex.test(trimmedEmail)) {
        newErrors.email = 'Debe proporcionar un correo electrónico válido';
      }
    }

    if (!password) {
      newErrors.password = 'La contraseña es obligatoria';
    } else if (password.length < 6) {
      newErrors.password = 'La contraseña debe tener al menos 6 caracteres';
    }

    if (!confirmPassword) {
      newErrors.confirmPassword = 'Debes confirmar tu contraseña';
    } else if (password !== confirmPassword) {
      newErrors.confirmPassword = 'Las contraseñas no coinciden';
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
      await register({
        name: name.trim(),
        email: email.trim(),
        password,
      });

      // Redirigir al catálogo/inicio tras registrar e iniciar sesión
      router.push('/');
    } catch (err: unknown) {
      if (err instanceof HttpClientError) {
        if (err.statusCode === 409) {
          setErrors({
            email: 'Este correo electrónico ya se encuentra registrado en GAUGE',
            general: 'El correo electrónico ya existe. Inicia sesión o utiliza otro correo.',
          });
        } else if (err.statusCode === 400) {
          setErrors({ general: err.message || 'Datos de registro incompletos o inválidos' });
        } else {
          setErrors({ general: err.message || 'Error del servidor durante el registro' });
        }
      } else if (err instanceof Error) {
        setErrors({ general: err.message });
      } else {
        setErrors({ general: 'Error desconocido durante la creación de la cuenta' });
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="w-full max-w-md mx-auto">
      <div className="glass-panel rounded-3xl p-6 sm:p-8 border border-frost-steel dark:border-steam-steel/50 shadow-2xl space-y-6">
        {/* Cabecera del Formulario */}
        <div className="text-center space-y-2.5 flex flex-col items-center">
          <BrandLogo size="md" showText={false} interactive={false} />
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-mono font-bold bg-sky-accent/15 dark:bg-steam-blue/20 text-sky-accent dark:text-steam-blue border border-sky-accent/30 dark:border-steam-blue/40">
            <UserPlus className="w-3.5 h-3.5" aria-hidden="true" />
            NUEVO REGISTRO · COMUNIDAD GAUGE
          </div>
          <h1 className="text-2xl sm:text-3xl font-black text-charcoal-text dark:text-pure-white font-sans uppercase">
            Crear Cuenta
          </h1>
          <p className="text-xs sm:text-sm text-active-slate dark:text-steam-light">
            Únete a la base de evaluadores técnicos y comparte tus métricas de juego.
          </p>
        </div>

        {/* Error general */}
        {errors.general && (
          <ErrorAlert
            title="Error en el registro"
            message={errors.general}
          />
        )}

        {/* Formulario */}
        <form onSubmit={handleSubmit} className="space-y-4" noValidate>
          {/* Nombre */}
          <div className="space-y-1.5">
            <label
              htmlFor="register-name"
              className="block text-xs font-bold uppercase font-mono tracking-wider text-charcoal-text dark:text-pure-white"
            >
              Nombre de Jugador
            </label>
            <div className="relative">
              <input
                id="register-name"
                type="text"
                autoComplete="name"
                value={name}
                onChange={(e) => {
                  setName(e.target.value);
                  if (errors.name) setErrors((prev) => ({ ...prev, name: undefined }));
                }}
                placeholder="Ej. Leon Kennedy"
                className={`w-full pl-10 pr-4 py-2.5 text-sm rounded-xl bg-white dark:bg-steam-dark/80 border text-charcoal-text dark:text-pure-white placeholder-active-slate/50 dark:placeholder-steam-light/50 focus-visible:outline-none focus-visible:ring-2 transition-all ${
                  errors.name
                    ? 'border-rose-500 focus-visible:ring-rose-500'
                    : 'border-frost-steel dark:border-steam-steel focus-visible:border-sky-accent dark:focus-visible:border-steam-blue focus-visible:ring-sky-accent dark:focus-visible:ring-steam-blue'
                }`}
              />
              <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-active-slate/60 dark:text-steam-light/60">
                <UserIcon className="w-4 h-4" aria-hidden="true" />
              </div>
            </div>
            {errors.name && (
              <p className="text-[11px] font-mono text-rose-500 dark:text-rose-400">
                {errors.name}
              </p>
            )}
          </div>

          {/* Correo Electrónico */}
          <div className="space-y-1.5">
            <label
              htmlFor="register-email"
              className="block text-xs font-bold uppercase font-mono tracking-wider text-charcoal-text dark:text-pure-white"
            >
              Correo Electrónico
            </label>
            <div className="relative">
              <input
                id="register-email"
                type="email"
                autoComplete="email"
                value={email}
                onChange={(e) => {
                  setEmail(e.target.value);
                  if (errors.email) setErrors((prev) => ({ ...prev, email: undefined }));
                }}
                placeholder="leon@rcpd.gov"
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
            <label
              htmlFor="register-password"
              className="block text-xs font-bold uppercase font-mono tracking-wider text-charcoal-text dark:text-pure-white"
            >
              Contraseña (mín. 6 caracteres)
            </label>
            <div className="relative">
              <input
                id="register-password"
                type={showPassword ? 'text' : 'password'}
                autoComplete="new-password"
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

          {/* Confirmar Contraseña */}
          <div className="space-y-1.5">
            <label
              htmlFor="register-confirm-password"
              className="block text-xs font-bold uppercase font-mono tracking-wider text-charcoal-text dark:text-pure-white"
            >
              Confirmar Contraseña
            </label>
            <div className="relative">
              <input
                id="register-confirm-password"
                type={showConfirmPassword ? 'text' : 'password'}
                autoComplete="new-password"
                value={confirmPassword}
                onChange={(e) => {
                  setConfirmPassword(e.target.value);
                  if (errors.confirmPassword) setErrors((prev) => ({ ...prev, confirmPassword: undefined }));
                }}
                placeholder="••••••••"
                className={`w-full pl-10 pr-11 py-2.5 text-sm rounded-xl bg-white dark:bg-steam-dark/80 border text-charcoal-text dark:text-pure-white placeholder-active-slate/50 dark:placeholder-steam-light/50 focus-visible:outline-none focus-visible:ring-2 transition-all ${
                  errors.confirmPassword
                    ? 'border-rose-500 focus-visible:ring-rose-500'
                    : 'border-frost-steel dark:border-steam-steel focus-visible:border-sky-accent dark:focus-visible:border-steam-blue focus-visible:ring-sky-accent dark:focus-visible:ring-steam-blue'
                }`}
              />
              <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-active-slate/60 dark:text-steam-light/60">
                <Lock className="w-4 h-4" aria-hidden="true" />
              </div>
              <button
                type="button"
                onClick={() => setShowConfirmPassword((prev) => !prev)}
                aria-label={showConfirmPassword ? 'Ocultar confirmación' : 'Ver confirmación'}
                className="absolute inset-y-0 right-0 pr-3.5 flex items-center text-active-slate/60 dark:text-steam-light/60 hover:text-charcoal-text dark:hover:text-pure-white transition-colors cursor-pointer"
              >
                {showConfirmPassword ? (
                  <EyeOff className="w-4 h-4" aria-hidden="true" />
                ) : (
                  <Eye className="w-4 h-4" aria-hidden="true" />
                )}
              </button>
            </div>
            {errors.confirmPassword && (
              <p className="text-[11px] font-mono text-rose-500 dark:text-rose-400">
                {errors.confirmPassword}
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
              leftIcon={<CheckCircle2 className="w-4 h-4" />}
            >
              Crear mi Cuenta de Jugador
            </Button>
          </div>
        </form>

        {/* Separador y enlace a login */}
        <div className="pt-4 border-t border-frost-steel/60 dark:border-steam-steel/30 text-center">
          <p className="text-xs text-active-slate dark:text-steam-light">
            ¿Ya tienes una cuenta registrada?{' '}
            <Link
              href="/login"
              className="font-bold text-sky-accent dark:text-steam-blue hover:underline inline-flex items-center gap-1"
            >
              <span>Iniciar Sesión</span>
              <LogIn className="w-3.5 h-3.5" aria-hidden="true" />
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}

