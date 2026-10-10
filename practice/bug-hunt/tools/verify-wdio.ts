/**
 * Checks the WebdriverIO practice exercises against the running demo app:
 *   - "runnable" exercises must FAIL as written and PASS as fixed in solutions/
 *   - "read and explain" exercises must PASS as fixed in solutions/
 *
 * Start the app first (npm run app), then:   npm run bug-hunt:verify:wdio
 */
import path from 'node:path';
import { listExercises, runNodeQuiet, WDIO_BIN, WDIO_CONFIG } from './exercises.ts';

const baseUrl = process.env.BASE_URL ?? 'http://localhost:4300';

try {
  await fetch(`${baseUrl}/api/health`);
} catch {
  console.error(`The demo app is not reachable at ${baseUrl}. Start it with "npm run app" and try again.`);
  process.exit(1);
}

function specPasses(folder: string, file: string): { passed: boolean; output: string } {
  const { status, output } = runNodeQuiet([WDIO_BIN, 'run', WDIO_CONFIG, '--spec', path.join(folder, file)]);
  return { passed: status === 0, output };
}

let problems = 0;
const rows: string[] = [];

for (const exercise of listExercises().filter((e) => e.kind !== 'vitest')) {
  const file = exercise.testFile ?? '';
  console.log(`Checking ${exercise.id}...`);

  const solution = specPasses(exercise.solutionDir, file);
  let buggyText = 'not checked (read and explain)';
  let ok = solution.passed;

  if (exercise.kind === 'wdio-runnable') {
    const buggy = specPasses(exercise.dir, file);
    buggyText = buggy.passed ? 'passed (expected a failure!)' : 'failed';
    ok = ok && !buggy.passed;
  }

  if (!solution.passed) console.log(solution.output.split('\n').slice(-40).join('\n'));
  if (!ok) problems += 1;
  rows.push(`${ok ? '✔' : '✘'}  ${exercise.id.padEnd(32)} buggy: ${buggyText.padEnd(32)} solution: ${solution.passed ? 'passed' : 'failed'}`);
}

console.log(`\n${rows.join('\n')}\n`);
if (problems > 0) {
  console.error(`${problems} WebdriverIO exercise(s) did not behave as expected.`);
  process.exit(1);
}
console.log('All WebdriverIO exercises behave as expected.');
