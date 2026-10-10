import { spawnSync } from 'node:child_process';
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

export const bugHuntDir = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
export const repoRoot = path.resolve(bugHuntDir, '..', '..');

/**
 * vitest        – has a *.test.js/ts file; checked by `bug-hunt:verify`.
 * wdio-runnable – WebdriverIO exercise whose buggy version FAILS against the app.
 * wdio-read     – WebdriverIO exercise to read and explain (the buggy version may even
 *                 pass, which is exactly the problem). Its solution must still pass.
 */
export type ExerciseKind = 'vitest' | 'wdio-runnable' | 'wdio-read';

// WebdriverIO exercises whose bug makes the test fail deterministically.
const RUNNABLE_WDIO = ['wdio-03', 'wdio-04', 'wdio-05', 'wdio-08'];

export interface Exercise {
  id: string; // folder name, e.g. "js-08-nightly-charges"
  dir: string; // absolute path to the buggy exercise
  solutionDir: string; // absolute path to the fixed version
  relativeDir: string; // e.g. "exercises/js-08-nightly-charges" (forward slashes)
  kind: ExerciseKind;
  testFile?: string; // file name of the test / e2e spec
}

function subfolders(dir: string): string[] {
  if (!fs.existsSync(dir)) return [];
  return fs
    .readdirSync(dir, { withFileTypes: true })
    .filter((entry) => entry.isDirectory())
    .map((entry) => path.join(dir, entry.name))
    .sort();
}

function toExercise(dir: string): Exercise {
  const id = path.basename(dir);
  const relativeDir = path.relative(bugHuntDir, dir).split(path.sep).join('/');
  const files = fs.readdirSync(dir);
  const vitestFile = files.find((file) => /\.test\.[jt]s$/.test(file));
  const e2eFile = files.find((file) => file.endsWith('.e2e.js'));

  let kind: ExerciseKind = 'wdio-read';
  if (vitestFile) kind = 'vitest';
  else if (RUNNABLE_WDIO.some((prefix) => id.startsWith(prefix))) kind = 'wdio-runnable';

  return {
    id,
    dir,
    solutionDir: path.join(bugHuntDir, 'solutions', relativeDir),
    relativeDir,
    kind,
    testFile: vitestFile ?? e2eFile,
  };
}

export function listExercises(): Exercise[] {
  const mainExercises = subfolders(path.join(bugHuntDir, 'exercises'));
  const mockExercises = subfolders(path.join(bugHuntDir, 'mock-rounds')).flatMap(subfolders);
  return [...mainExercises, ...mockExercises].map(toExercise);
}

/** Runs a Node CLI (vitest or wdio) from the repo root, showing its output. Returns the exit code. */
export function runNode(args: string[], env: Record<string, string> = {}): number {
  const result = spawnSync(process.execPath, args, {
    cwd: repoRoot,
    stdio: 'inherit',
    env: { ...process.env, ...env },
  });
  return result.status ?? 1;
}

/** Same as runNode, but captures the output instead of printing it. */
export function runNodeQuiet(args: string[], env: Record<string, string> = {}): { status: number; output: string } {
  const result = spawnSync(process.execPath, args, {
    cwd: repoRoot,
    encoding: 'utf8',
    env: { ...process.env, ...env },
    // Buggy code can contain an infinite loop that no test timeout can interrupt.
    timeout: 5 * 60 * 1000,
  });
  return { status: result.status ?? 1, output: `${result.stdout ?? ''}${result.stderr ?? ''}` };
}

export const VITEST_BIN = path.join(repoRoot, 'node_modules', 'vitest', 'vitest.mjs');
export const WDIO_BIN = path.join(repoRoot, 'node_modules', '@wdio', 'cli', 'bin', 'wdio.js');
export const VITEST_CONFIG = path.join(bugHuntDir, 'vitest.config.ts');
export const WDIO_CONFIG = path.join(bugHuntDir, 'wdio.practice.conf.js');
