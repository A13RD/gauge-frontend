import { API_BASE_URL, TOKEN_STORAGE_KEY, USER_STORAGE_KEY } from './config';

export interface ApiErrorResponse {
  statusCode?: number;
  message?: string;
  error?: string;
}

export class HttpClientError extends Error {
  public statusCode: number;

  constructor(statusCode: number, message: string) {
    super(message);
    this.name = 'HttpClientError';
    this.statusCode = statusCode;
    Object.setPrototypeOf(this, HttpClientError.prototype);
  }
}

interface RequestOptions extends Omit<RequestInit, 'body'> {
  body?: unknown;
}

async function request<T>(
  endpoint: string,
  options: RequestOptions = {}
): Promise<T> {
  const cleanBaseUrl = API_BASE_URL.replace(/\/+$/, '');
  const normalizedEndpoint = endpoint.startsWith('/') ? endpoint : `/${endpoint}`;
  const url = `${cleanBaseUrl}${normalizedEndpoint}`;

  const headers = new Headers(options.headers || {});

  // 1. Inyección de JWT en el cliente si existe
  if (typeof window !== 'undefined') {
    const token = localStorage.getItem(TOKEN_STORAGE_KEY);
    if (token && !headers.has('Authorization')) {
      headers.set('Authorization', `Bearer ${token}`);
    }
  }

  // 2. Determinar cuerpo y Content-Type
  const isFormData = options.body instanceof FormData;
  let bodyContent: BodyInit | null | undefined = undefined;

  if (options.body !== undefined && options.body !== null) {
    if (isFormData) {
      bodyContent = options.body as FormData;
      // El navegador asigna automáticamente multipart/form-data con boundary
      headers.delete('Content-Type');
    } else if (typeof options.body === 'string') {
      bodyContent = options.body;
      if (!headers.has('Content-Type')) {
        headers.set('Content-Type', 'application/json');
      }
    } else {
      bodyContent = JSON.stringify(options.body);
      if (!headers.has('Content-Type')) {
        headers.set('Content-Type', 'application/json');
      }
    }
  }

  const { body: _rawBody, ...restOptions } = options;

  let response: Response;
  try {
    response = await fetch(url, {
      ...restOptions,
      headers,
      body: bodyContent,
    });
  } catch (error) {
    const networkMessage =
      error instanceof Error ? error.message : 'Error de conexión con el servidor';
    throw new HttpClientError(0, networkMessage);
  }

  // 3. Manejo de 401 Unauthorized
  if (response.status === 401) {
    const isAuthEndpoint =
      normalizedEndpoint.includes('/auth/login') ||
      normalizedEndpoint.includes('/auth/register');

    if (typeof window !== 'undefined' && !isAuthEndpoint) {
      localStorage.removeItem(TOKEN_STORAGE_KEY);
      localStorage.removeItem(USER_STORAGE_KEY);
      window.dispatchEvent(new Event('gauge:unauthorized'));
      if (!window.location.pathname.startsWith('/login')) {
        window.location.href = '/login?expired=true';
      }
    }

    let message = 'Sesión expirada o no autorizada';
    try {
      const errorJson = (await response.json()) as ApiErrorResponse;
      message = errorJson.message || errorJson.error || message;
    } catch {
      // Usar mensaje predeterminado si no hay cuerpo JSON
    }
    throw new HttpClientError(401, message);
  }

  // 4. Respuestas con error (4xx, 5xx)
  if (!response.ok) {
    let errorMessage = `Error HTTP ${response.status}: ${response.statusText || 'Error inesperado'}`;
    try {
      const errorData = (await response.json()) as ApiErrorResponse;
      errorMessage = errorData.message || errorData.error || errorMessage;
    } catch {
      // Usar mensaje statusText si no es JSON
    }
    throw new HttpClientError(response.status, errorMessage);
  }

  // 5. Respuestas 204 No Content o vacías
  if (response.status === 204) {
    return {} as T;
  }

  const contentLength = response.headers.get('content-length');
  if (contentLength === '0') {
    return {} as T;
  }

  const contentType = response.headers.get('content-type') || '';
  if (contentType.includes('application/json')) {
    return (await response.json()) as T;
  }

  return (await response.text()) as unknown as T;
}

export const httpClient = {
  get: <T>(endpoint: string, options?: RequestOptions) =>
    request<T>(endpoint, { ...options, method: 'GET' }),

  post: <T>(endpoint: string, body?: unknown, options?: RequestOptions) =>
    request<T>(endpoint, { ...options, method: 'POST', body }),

  put: <T>(endpoint: string, body?: unknown, options?: RequestOptions) =>
    request<T>(endpoint, { ...options, method: 'PUT', body }),

  patch: <T>(endpoint: string, body?: unknown, options?: RequestOptions) =>
    request<T>(endpoint, { ...options, method: 'PATCH', body }),

  delete: <T>(endpoint: string, options?: RequestOptions) =>
    request<T>(endpoint, { ...options, method: 'DELETE' }),
};

