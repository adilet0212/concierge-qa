/**
 * Downloads the WebdriverIO native demo app (Android APK) into apps/ (git-ignored).
 *   npm run mobile:download-app
 */
import fs from 'node:fs';
import path from 'node:path';
import { DEMO_APP_PATH, DEMO_APP_URL } from '../tests/mobile/demo-app.ts';

if (fs.existsSync(DEMO_APP_PATH)) {
  console.log(`Already downloaded: ${path.relative(process.cwd(), DEMO_APP_PATH)}`);
  process.exit(0);
}

console.log(`Downloading ${DEMO_APP_URL} ...`);
const response = await fetch(DEMO_APP_URL); // GitHub redirects to its file storage; fetch follows it
if (!response.ok) {
  console.error(`Download failed: HTTP ${response.status}`);
  process.exit(1);
}

const bytes = Buffer.from(await response.arrayBuffer());
fs.mkdirSync(path.dirname(DEMO_APP_PATH), { recursive: true });
fs.writeFileSync(DEMO_APP_PATH, bytes);
console.log(`Saved ${path.relative(process.cwd(), DEMO_APP_PATH)} (${(bytes.length / 1024 / 1024).toFixed(1)} MB)`);
