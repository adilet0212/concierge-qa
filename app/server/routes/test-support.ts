import { Router } from 'express';
import { sendError } from '../http.ts';
import { resetStore, store } from '../store.ts';

// Endpoints that exist only to make testing fast and reliable.
// A production build would not register these routes.

export const devRoutes = Router();

// The "dev inbox": shows the one-time code we pretended to email. Tests read codes from here,
// the same way a team would use a test mailbox service in a real environment.
devRoutes.get('/inbox', (req, res) => {
  const email = String(req.query.email ?? '').trim().toLowerCase();
  const pending = store.codes.get(email);
  if (!pending) {
    sendError(res, 404, 'NO_CODE', 'No code has been sent to this email.');
    return;
  }
  res.json({ email: pending.email, code: pending.code, expiresAt: new Date(pending.expiresAt).toISOString() });
});

export const testRoutes = Router();

// Wipes all data. Call it ONCE before a whole test run, never inside individual tests:
// tests run in parallel and a reset would delete the other tests' data mid-run.
testRoutes.post('/reset', (_req, res) => {
  resetStore();
  res.status(204).end();
});

// Makes a guest's pending code expire now, so the "expired code" test needn't wait 10 minutes.
testRoutes.post('/expire-code', (req, res) => {
  const email = String(req.body?.email ?? '').trim().toLowerCase();
  const pending = store.codes.get(email);
  if (!pending) {
    sendError(res, 404, 'NO_CODE', 'No code has been sent to this email.');
    return;
  }
  pending.expiresAt = Date.now() - 1;
  res.status(204).end();
});
