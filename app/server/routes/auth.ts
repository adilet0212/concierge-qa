import { randomInt, randomUUID } from 'node:crypto';
import { Router } from 'express';
import { currentGuest, requireGuest, sendError } from '../http.ts';
import { store } from '../store.ts';

export const CODE_LENGTH = 6;
const CODE_LIFETIME_MS = 10 * 60 * 1000;
const EMAIL_PATTERN = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

export const authRoutes = Router();

/** "ava.smith+test1@example.com" -> "Ava" */
function nameFromEmail(email: string): string {
  const firstWord = email.split('@')[0].split(/[.+_\-\d]/)[0];
  return firstWord ? firstWord[0].toUpperCase() + firstWord.slice(1).toLowerCase() : 'Guest';
}

// Step 1: the guest enters their email and we "send" a one-time code.
// In this demo the code is not emailed; it appears in the dev inbox (GET /api/dev/inbox).
authRoutes.post('/request-code', (req, res) => {
  const email = String(req.body?.email ?? '').trim().toLowerCase();
  if (!EMAIL_PATTERN.test(email)) {
    sendError(res, 400, 'INVALID_EMAIL', 'Enter a valid email address.');
    return;
  }

  const code = String(randomInt(0, 10 ** CODE_LENGTH)).padStart(CODE_LENGTH, '0');
  store.codes.set(email, { email, code, expiresAt: Date.now() + CODE_LIFETIME_MS });
  res.status(202).json({ message: 'CODE_SENT', codeLength: CODE_LENGTH });
});

// Step 2: the guest types the code; if it matches and hasn't expired, they get a session token.
authRoutes.post('/verify-code', (req, res) => {
  const email = String(req.body?.email ?? '').trim().toLowerCase();
  const code = String(req.body?.code ?? '').trim();
  const pending = store.codes.get(email);

  if (!pending || pending.code !== code) {
    sendError(res, 401, 'CODE_INVALID', 'That code is incorrect.');
    return;
  }
  if (pending.expiresAt < Date.now()) {
    sendError(res, 401, 'CODE_EXPIRED', 'This code has expired. Request a new one.');
    return;
  }

  store.codes.delete(email); // one-time: a code can't be used twice
  if (!store.guests.has(email)) store.guests.set(email, { email, name: nameFromEmail(email) });

  const token = randomUUID();
  store.sessions.set(token, email);
  res.json({ token, guest: store.guests.get(email) });
});

authRoutes.post('/sign-out', requireGuest, (_req, res) => {
  store.sessions.delete(res.locals.token as string);
  res.status(204).end();
});

export const meRoutes = Router();

meRoutes.get('/', requireGuest, (_req, res) => {
  res.json(currentGuest(res));
});
