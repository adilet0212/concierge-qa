/**
 * The seeded-bug check, in one command:   npm run test:seeded-bugs
 *
 * 1. Makes sure the app is running in seeded-bug mode (start it with: npm run app:bugs).
 * 2. Runs the full regression suite. Failures are EXPECTED here, so its exit code is ignored.
 * 3. Runs scripts/seeded-bug-report.ts, which passes only if all six seeded bugs were caught.
 */
import { spawnSync } from 'node:child_process';
import path from 'node:path';

const baseUrl = process.env.BASE_URL ?? 'http://localhost:4300';
const health = await fetch(`${baseUrl}/api/health`)
  .then((response) => response.json())
  .catch(() => undefined);

if (!health?.seededBugs?.length) {
  console.error(`The app at ${baseUrl} is not in seeded-bug mode. Start it with: npm run app:bugs`);
  process.exit(1);
}

const bin = (name: string) => path.join(process.cwd(), 'node_modules', ...name.split('/'));

console.log(`Seeded bugs switched on: ${health.seededBugs.join(', ')}. Running the regression suite (failures expected)...\n`);
spawnSync(process.execPath, [bin('@wdio/cli/bin/wdio.js'), 'run', 'tests/web/wdio.conf.ts', '--mochaOpts.grep', '@regression'], {
  stdio: 'inherit',
});

const report = spawnSync(process.execPath, [bin('tsx/dist/cli.mjs'), 'scripts/seeded-bug-report.ts'], { stdio: 'inherit' });
process.exit(report.status ?? 1);
