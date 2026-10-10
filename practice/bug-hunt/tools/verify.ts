/**
 * Proves the practice pack is honest:
 *   every runnable exercise FAILS on the buggy code and PASSES on solutions/.
 *
 * It runs the whole Vitest suite twice (buggy, then solutions) and compares
 * the result of each test file.   npm run bug-hunt:verify
 */
import fs from 'node:fs';
import path from 'node:path';
import { bugHuntDir, listExercises, repoRoot, runNodeQuiet, VITEST_BIN, VITEST_CONFIG } from './exercises.ts';

interface VitestJson {
  testResults: { name: string; status: string }[];
}

const outputDir = path.join(repoRoot, 'reports', 'bug-hunt');
fs.mkdirSync(outputDir, { recursive: true });

/** Runs every Vitest exercise and returns a map of "relative test path" -> "passed" | "failed". */
function runSuite(label: string, env: Record<string, string>): Map<string, string> {
  const outputFile = path.join(outputDir, `${label}.json`);
  console.log(`Running all exercises against the ${label} code...`);
  // The exit code is ignored on purpose: in the buggy run, failures are expected.
  runNodeQuiet([VITEST_BIN, 'run', '--config', VITEST_CONFIG, '--reporter=json', `--outputFile=${outputFile}`], env);

  const report = JSON.parse(fs.readFileSync(outputFile, 'utf8')) as VitestJson;
  const statuses = new Map<string, string>();
  for (const result of report.testResults) {
    const relative = path.relative(bugHuntDir, result.name).split(path.sep).join('/');
    statuses.set(relative, result.status);
  }
  return statuses;
}

const buggy = runSuite('buggy', {});
const fixed = runSuite('solution', { BUG_HUNT_SOLUTIONS: '1' });

const rows: string[] = [];
let problems = 0;

for (const exercise of listExercises().filter((e) => e.kind === 'vitest')) {
  const testPath = `${exercise.relativeDir}/${exercise.testFile}`;
  const buggyStatus = buggy.get(testPath) ?? 'missing';
  const fixedStatus = fixed.get(testPath) ?? 'missing';
  const ok = buggyStatus === 'failed' && fixedStatus === 'passed';
  if (!ok) problems += 1;
  rows.push(`${ok ? '✔' : '✘'}  ${exercise.relativeDir.padEnd(52)} buggy: ${buggyStatus.padEnd(7)} solution: ${fixedStatus}`);
}

console.log(`\n${rows.join('\n')}\n`);
if (problems > 0) {
  console.error(`${problems} exercise(s) did not behave as expected (should fail when buggy, pass when fixed).`);
  process.exit(1);
}
console.log(`All ${rows.length} runnable exercises fail on the buggy code and pass on the solution.`);
console.log('WebdriverIO exercises are checked separately: npm run bug-hunt:verify:wdio (needs npm run app).');
