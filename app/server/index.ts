import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import express from 'express';
import { getEnabledBugs, parseBugMode, SEEDED_BUGS, setEnabledBugs } from '../shared/seeded-bugs.ts';
import { sendError } from './http.ts';
import { authRoutes, meRoutes } from './routes/auth.ts';
import { bookingRoutes } from './routes/bookings.ts';
import { chatRoutes } from './routes/chat.ts';
import { orderRoutes } from './routes/orders.ts';
import { propertyRoutes } from './routes/properties.ts';
import { requestRoutes } from './routes/requests.ts';
import { spaRoutes } from './routes/spa.ts';
import { staffRoutes } from './routes/staff.ts';
import { devRoutes, testRoutes } from './routes/test-support.ts';

const PORT = Number(process.env.PORT ?? 4300);
const webDist = path.join(path.dirname(fileURLToPath(import.meta.url)), '..', 'web', 'dist');

setEnabledBugs(parseBugMode(process.env.BUG_MODE));

const app = express();
app.use(express.json());

// --- API ---------------------------------------------------------------------
app.get('/api/health', (_req, res) => {
  res.json({ status: 'ok', seededBugs: getEnabledBugs() });
});
// The browser asks which seeded bugs are on, so client-side bugs follow BUG_MODE too.
app.get('/api/config', (_req, res) => {
  res.json({ seededBugs: getEnabledBugs() });
});

app.use('/api/auth', authRoutes);
app.use('/api/me', meRoutes);
app.use('/api/properties', propertyRoutes);
app.use('/api/bookings', bookingRoutes);
app.use('/api/orders', orderRoutes);
app.use('/api/requests', requestRoutes);
app.use('/api/chat', chatRoutes);
app.use('/api/spa', spaRoutes);
app.use('/api/staff', staffRoutes);
app.use('/api/dev', devRoutes);
app.use('/api/test', testRoutes);

app.use('/api', (_req, res) => {
  sendError(res, 404, 'NOT_FOUND', 'Unknown API endpoint.');
});

// --- Web app -------------------------------------------------------------------
// Serve the built React app, and send index.html for every other path so deep links
// like /properties/tokyo/book work on reload (the React router takes over in the browser).
if (!fs.existsSync(path.join(webDist, 'index.html'))) {
  console.warn('The web app is not built yet. Run "npm run app" (it builds first).');
}
app.use(express.static(webDist));
app.get('/{*path}', (_req, res) => {
  res.sendFile(path.join(webDist, 'index.html'));
});

// Express 5 calls this with an error when the server could NOT start. The usual cause is the
// app already running in another terminal. Without this check we would print "running" and exit.
app.listen(PORT, (error) => {
  if (error) {
    console.error(`Could not start the Aurelle demo app on port ${PORT}: ${error.message}`);
    console.error('Is it already running in another terminal? Stop that one (Ctrl+C) and try again.');
    process.exit(1);
  }
  const bugs = getEnabledBugs();
  console.log(`Aurelle demo app running at http://localhost:${PORT}`);
  if (bugs.length > 0) {
    console.log(`SEEDED-BUG MODE: ${bugs.length} regression(s) switched on:`);
    for (const id of bugs) console.log(`  #${id} ${SEEDED_BUGS[id as keyof typeof SEEDED_BUGS]}`);
  }
});
