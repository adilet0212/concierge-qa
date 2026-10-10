import type { NextFunction, Request, Response } from 'express';
import type { ApiErrorBody, Guest } from '../shared/types.ts';
import { store } from './store.ts';

/** Sends the standard error body: { error, message, details? }. */
export function sendError(res: Response, status: number, error: string, message: string, details?: string[]): void {
  const body: ApiErrorBody = { error, message };
  if (details) body.details = details;
  res.status(status).json(body);
}

/** The signed-in guest, set by requireGuest. */
export function currentGuest(res: Response): Guest {
  return res.locals.guest as Guest;
}

/** Middleware: rejects the request with 401 unless it has a valid "Authorization: Bearer <token>". */
export function requireGuest(req: Request, res: Response, next: NextFunction): void {
  const token = req.get('authorization')?.replace(/^Bearer /, '') ?? '';
  const email = store.sessions.get(token);
  const guest = email ? store.guests.get(email) : undefined;

  if (!guest) {
    sendError(res, 401, 'UNAUTHORIZED', 'Sign in to continue.');
    return;
  }
  res.locals.guest = guest;
  res.locals.token = token;
  next();
}

export function isNonEmptyString(value: unknown): value is string {
  return typeof value === 'string' && value.trim().length > 0;
}
