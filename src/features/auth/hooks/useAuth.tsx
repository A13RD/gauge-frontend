'use client';

import React, {
  createContext,
  useContext,
  useState,
  useEffect,
  useCallback,
  useMemo,
} from 'react';
import { User, LoginDTO, RegisterDTO, AuthResponse } from '../domain/auth.types';
import { authService } from '../services/auth.service';
import { TOKEN_STORAGE_KEY, USER_STORAGE_KEY } from '@/features/common/config';
import { HttpClientError } from '@/features/common/http';

export interface AuthContextType {
  user: User | null;
  token: string | null;
  isLoading: boolean;
  isAuthenticated: boolean;
  isAdmin: boolean;
  login: (credentials: LoginDTO) => Promise<AuthResponse>;
  register: (data: RegisterDTO) => Promise<AuthResponse>;
  logout: () => void;
  refreshSession: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [token, setToken] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(true);

  // Limpiar sesión localmente
  const clearSession = useCallback(() => {
    if (typeof window !== 'undefined') {
      localStorage.removeItem(TOKEN_STORAGE_KEY);
      localStorage.removeItem(USER_STORAGE_KEY);
    }
    setUser(null);
    setToken(null);
  }, []);

  // Guardar sesión localmente
  const persistSession = useCallback((newToken: string, newUser: User) => {
    if (typeof window !== 'undefined') {
      localStorage.setItem(TOKEN_STORAGE_KEY, newToken);
      // Seguridad: Únicamente persistir datos públicos del perfil (id, name, email, role), nunca credenciales
      localStorage.setItem(
        USER_STORAGE_KEY,
        JSON.stringify({
          id: newUser.id,
          name: newUser.name,
          email: newUser.email,
          role: newUser.role,
        })
      );
    }
    setToken(newToken);
    setUser(newUser);
  }, []);

  // Revalidar sesión contra GET /api/auth/me en el backend
  const refreshSession = useCallback(async () => {
    const storedToken = typeof window !== 'undefined' ? localStorage.getItem(TOKEN_STORAGE_KEY) : null;
    if (!storedToken) {
      clearSession();
      return;
    }

    try {
      const response = await authService.getMe();
      if (response && response.user) {
        setUser(response.user);
        if (typeof window !== 'undefined') {
          localStorage.setItem(USER_STORAGE_KEY, JSON.stringify(response.user));
        }
      }
    } catch (error) {
      if (error instanceof HttpClientError && error.statusCode === 401) {
        clearSession();
      }
    }
  }, [clearSession]);

  // Inicialización de sesión al montar en el navegador
  useEffect(() => {
    let isMounted = true;

    const initializeAuth = async () => {
      try {
        if (typeof window !== 'undefined') {
          const storedToken = localStorage.getItem(TOKEN_STORAGE_KEY);
          const storedUserJson = localStorage.getItem(USER_STORAGE_KEY);

          if (storedToken && storedUserJson) {
            try {
              const parsedUser = JSON.parse(storedUserJson) as User;
              if (parsedUser && parsedUser.id) {
                setToken(storedToken);
                setUser(parsedUser);
              }
            } catch {
              localStorage.removeItem(USER_STORAGE_KEY);
            }
          }

          // Si hay token, validar con backend en segundo plano
          if (storedToken) {
            try {
              const profile = await authService.getMe();
              if (isMounted && profile && profile.user) {
                setUser(profile.user);
                localStorage.setItem(USER_STORAGE_KEY, JSON.stringify(profile.user));
              }
            } catch (err) {
              if (isMounted && err instanceof HttpClientError && err.statusCode === 401) {
                clearSession();
              }
            }
          }
        }
      } finally {
        if (isMounted) {
          setIsLoading(false);
        }
      }
    };

    initializeAuth();

    // Escuchar eventos globales de 401 emitidos por el cliente HTTP
    const handleUnauthorizedEvent = () => {
      clearSession();
    };

    if (typeof window !== 'undefined') {
      window.addEventListener('gauge:unauthorized', handleUnauthorizedEvent);
    }

    return () => {
      isMounted = false;
      if (typeof window !== 'undefined') {
        window.removeEventListener('gauge:unauthorized', handleUnauthorizedEvent);
      }
    };
  }, [clearSession]);

  // Iniciar sesión
  const login = useCallback(
    async (credentials: LoginDTO): Promise<AuthResponse> => {
      setIsLoading(true);
      try {
        const response = await authService.login(credentials);
        persistSession(response.token, response.user);
        return response;
      } finally {
        setIsLoading(false);
      }
    },
    [persistSession]
  );

  // Registro de usuario
  const register = useCallback(
    async (data: RegisterDTO): Promise<AuthResponse> => {
      setIsLoading(true);
      try {
        const response = await authService.register(data);
        if (response.token && response.user) {
          persistSession(response.token, response.user);
        }
        return response;
      } finally {
        setIsLoading(false);
      }
    },
    [persistSession]
  );

  // Cerrar sesión
  const logout = useCallback(() => {
    clearSession();
    if (typeof window !== 'undefined') {
      window.location.href = '/login';
    }
  }, [clearSession]);

  const isAuthenticated = useMemo(() => Boolean(token && user), [token, user]);
  const isAdmin = useMemo(() => user?.role === 'ADMIN', [user]);

  const value = useMemo<AuthContextType>(
    () => ({
      user,
      token,
      isLoading,
      isAuthenticated,
      isAdmin,
      login,
      register,
      logout,
      refreshSession,
    }),
    [user, token, isLoading, isAuthenticated, isAdmin, login, register, logout, refreshSession]
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth(): AuthContextType {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth debe ser utilizado dentro de un AuthProvider');
  }
  return context;
}

