import axios from 'axios';
import useSWR, { mutate } from 'swr';

export const ENDPOINT = 'http://localhost:8080';

export const backend = axios.create({
  baseURL: ENDPOINT,
});

backend.interceptors.request.use((config) => {
  const token = getToken();
  if (!token)
    return config;

  config.headers = config.headers || {};
  config.headers['Authorization'] = `Bearer ${token}`;
  return config;
});

backend.interceptors.response.use(res => res, (error) => {
  if (error?.response?.status === 401)
    clearToken();

  return Promise.reject(error);
});

export function invalidateSWRCache() {
  mutate(() => true, undefined, { revalidate: true });
}

export function getToken(): string | null {
  return localStorage.getItem('token');
}

export function setToken(token: string) {
  localStorage.setItem('token', token);
  invalidateSWRCache();
}

export function clearToken() {
  if (getToken() == null)
    return;

  localStorage.removeItem('token');
  invalidateSWRCache();
}

export function useSWRCustom<T>(fetcher: (...args: any[]) => Promise<T>, args: any[] | null) {
  if (args === null)
    return useSWR(null, fetcher);

  return useSWR([fetcher].concat(args), () => fetcher(...args));
}
