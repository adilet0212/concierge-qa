import { useEffect, useState } from 'react';
import type { ApiErrorBody } from '../../shared/types.ts';

const TOKEN_KEY = 'aurelle.session';

export function getToken(): string | null {
  return window.localStorage.getItem(TOKEN_KEY);
}

export function setToken(token: string | null): void {
  if (token) window.localStorage.setItem(TOKEN_KEY, token);
  else window.localStorage.removeItem(TOKEN_KEY);
}

export class ApiError extends Error {
  constructor(
    public status: number,
    public code: string,
    message: string,
    public details: string[] = [],
  ) {
    super(message);
  }
}

/** Calls the API with the session token and turns error responses into ApiError. */
export async function api<T>(method: string, path: string, body?: unknown): Promise<T> {
  const headers: Record<string, string> = { 'Content-Type': 'application/json' };
  const token = getToken();
  if (token) headers.Authorization = `Bearer ${token}`;

  const response = await fetch(path, {
    method,
    headers,
    body: body === undefined ? undefined : JSON.stringify(body),
  });
  if (response.status === 204) return undefined as T;

  const data = await response.json().catch(() => ({}));
  if (!response.ok) {
    const problem = data as Partial<ApiErrorBody>;
    throw new ApiError(response.status, problem.error ?? 'UNKNOWN', problem.message ?? 'Request failed', problem.details);
  }
  return data as T;
}

/**
 * Loads `path` (skips while it is null). With refreshMs > 0 it polls, which is how the
 * order and request pages pick up status changes made by staff.
 */
export function useApi<T>(path: string | null, refreshMs = 0) {
  const [data, setData] = useState<T | undefined>(undefined);
  const [error, setError] = useState<ApiError | undefined>(undefined);
  const [version, setVersion] = useState(0);

  useEffect(() => {
    if (!path) return;
    let cancelled = false;
    api<T>('GET', path)
      .then((result) => {
        if (!cancelled) {
          setData(result);
          setError(undefined);
        }
      })
      .catch((problem: ApiError) => {
        if (!cancelled) setError(problem);
      });
    return () => {
      cancelled = true;
    };
  }, [path, version]);

  useEffect(() => {
    if (!path || refreshMs <= 0) return;
    const timer = window.setInterval(() => setVersion((v) => v + 1), refreshMs);
    return () => window.clearInterval(timer);
  }, [path, refreshMs]);

  return { data, error, reload: () => setVersion((v) => v + 1) };
}

/** A unique id for idempotency keys. (crypto.randomUUID needs HTTPS outside localhost.) */
export function uniqueId(): string {
  return `${Date.now().toString(36)}-${Math.random().toString(36).slice(2, 10)}`;
}
