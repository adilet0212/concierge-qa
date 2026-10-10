import path from 'node:path';
import { fileURLToPath } from 'node:url';
import react from '@vitejs/plugin-react';
import { defineConfig } from 'vite';

const appDir = path.dirname(fileURLToPath(import.meta.url));

// Builds the React app into app/web/dist; the Express server (app/server) serves it
// together with the API on one fixed URL: http://localhost:4300.
export default defineConfig({
  root: path.join(appDir, 'web'),
  plugins: [react()],
  build: {
    outDir: path.join(appDir, 'web', 'dist'),
    emptyOutDir: true,
  },
});
