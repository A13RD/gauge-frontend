import { httpClient } from '@/features/common/http';
import {
  AuthResponse,
  LoginDTO,
  RegisterDTO,
  UserProfileResponse,
} from '../domain/auth.types';

/**
 * Servicio encargado de la comunicación con los endpoints de autenticación y sesión
 */
export const authService = {
  /**
   * Registro de nuevo usuario en la plataforma
   * POST /api/auth/register
   */
  async register(data: RegisterDTO): Promise<AuthResponse> {
    return httpClient.post<AuthResponse>('/auth/register', data);
  },

  /**
   * Inicio de sesión con credenciales
   * POST /api/auth/login
   */
  async login(credentials: LoginDTO): Promise<AuthResponse> {
    return httpClient.post<AuthResponse>('/auth/login', credentials);
  },

  /**
   * Obtiene la información del usuario autenticado actual a partir del token JWT
   * GET /api/auth/me
   */
  async getMe(): Promise<UserProfileResponse> {
    return httpClient.get<UserProfileResponse>('/auth/me');
  },

  /**
   * Endpoint de prueba para verificar autorización RBAC con rol ADMIN
   * GET /api/auth/admin-only
   */
  async checkAdminAccess(): Promise<{ message: string }> {
    return httpClient.get<{ message: string }>('/auth/admin-only');
  },
};

