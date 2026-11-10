const rawHost = (process.env.NEXT_PUBLIC_API_HOST || 'http://localhost:4000/api').trim();
const trimmedHost = rawHost.replace(/\/+$/, '');
export const API_BASE_URL = trimmedHost.endsWith('/api')
  ? trimmedHost
  : `${trimmedHost}/api`;

export const TOKEN_STORAGE_KEY = 'gauge_auth_token';
export const USER_STORAGE_KEY = 'gauge_auth_user';
export const THEME_STORAGE_KEY = 'gauge_theme';

