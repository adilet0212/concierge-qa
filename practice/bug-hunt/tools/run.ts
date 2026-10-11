/**
 * Runs the test for ONE exercise.
 *
 *   npm run bug-hunt -- js-08              run against your (buggy or fixed) code
 *   npm run bug-hunt -- js-08 --solution   run the same test against solutions/
 *
 * WebdriverIO exercises need the demo app running first (`npm run app`).
 */
import path from 'node:path';
import { listExercises, runNode, VITEST_BIN, VITEST_CONFIG, WDIO_BIN, WDIO_CONFIG } from './exercises.ts';

const [query, ...flags] = process.argv.slice(2);
const useSolution = flags.includes('--solution');
const exercises = listExercises();

if (!query) {
  console.log('Usage: npm run bug-hunt -- <exercise> [--solution]\n\nExercises:');
  for (const exercise of exercises) console.log(`  ${exercise.relativeDir}`);
  process.exit(0); // listing the exercises is a normal use, not an error
}

const matches = exercises.filter((exercise) => exercise.id === query || exercise.id.startsWith(query));
if (matches.length !== 1) {
  const found = matches.map((exercise) => exercise.id).join(', ') || 'none';
  console.error(`"${query}" should match exactly one exercise (found: ${found}).`);
  process.exit(1);
}

const exercise = matches[0];
console.log(`\n▶ ${exercise.relativeDir}${useSolution ? '  (solution)' : ''}\n`);

let exitCode: number;
if (exercise.kind === 'vitest') {
  exitCode = runNode(
    [VITEST_BIN, 'run', '--config', VITEST_CONFIG, exercise.relativeDir],
    useSolution ? { BUG_HUNT_SOLUTIONS: '1' } : {},
  );
} else {
  const folder = useSolution ? exercise.solutionDir : exercise.dir;
  const spec = path.join(folder, exercise.testFile ?? '');
  exitCode = runNode([WDIO_BIN, 'run', WDIO_CONFIG, '--spec', spec]);
  if (exercise.kind === 'wdio-read') {
    console.log('\nThis is a read-and-explain exercise: a green run does not mean the test is correct.');
  }
}

process.exit(exitCode);
