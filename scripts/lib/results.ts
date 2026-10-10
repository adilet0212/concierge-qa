import fs from 'node:fs';
import path from 'node:path';

// Reads the per-attempt results written by tests/web/support/results-recorder.ts
// and reduces them to one final result per test (per browser profile).

export interface AttemptRecord {
  profile: string;
  spec: string;
  title: string;
  passed: boolean;
  attempt: number;
  maxRetries: number;
  durationMs: number;
  error?: string;
}

export interface FinalResult {
  profile: string;
  spec: string;
  title: string;
  passed: boolean;
  /** Passed, but only after a failed attempt: the test is unreliable and needs attention. */
  flaky: boolean;
  attempts: number;
  durationMs: number; // all attempts added up
  error?: string;
}

export const RESULTS_DIR = path.join(process.cwd(), 'reports', 'results');

export function loadAttempts(dir = RESULTS_DIR): AttemptRecord[] {
  if (!fs.existsSync(dir)) return [];
  return fs
    .readdirSync(dir)
    .filter((file) => file.endsWith('.jsonl'))
    .flatMap((file) => fs.readFileSync(path.join(dir, file), 'utf8').split('\n'))
    .filter((line) => line.trim() !== '')
    .map((line) => JSON.parse(line) as AttemptRecord);
}

export function finalResults(attempts: AttemptRecord[] = loadAttempts()): FinalResult[] {
  const byTest = new Map<string, AttemptRecord[]>();
  for (const attempt of attempts) {
    const key = `${attempt.profile}::${attempt.spec}::${attempt.title}`;
    byTest.set(key, [...(byTest.get(key) ?? []), attempt]);
  }

  return [...byTest.values()].map((runs) => {
    runs.sort((a, b) => a.attempt - b.attempt);
    const last = runs[runs.length - 1];
    return {
      profile: last.profile,
      spec: last.spec,
      title: last.title,
      passed: last.passed,
      flaky: last.passed && runs.some((run) => !run.passed),
      attempts: runs.length,
      durationMs: runs.reduce((sum, run) => sum + run.durationMs, 0),
      error: last.passed ? undefined : last.error,
    };
  });
}

/** Writes markdown to the GitHub Actions job summary (if running in Actions) and to the console. */
export function publishMarkdown(markdown: string): void {
  console.log(markdown);
  const summaryFile = process.env.GITHUB_STEP_SUMMARY;
  if (summaryFile) fs.appendFileSync(summaryFile, `${markdown}\n`);
}

export function formatDuration(ms: number): string {
  const seconds = Math.round(ms / 1000);
  return seconds >= 60 ? `${Math.floor(seconds / 60)}m ${seconds % 60}s` : `${seconds}s`;
}
