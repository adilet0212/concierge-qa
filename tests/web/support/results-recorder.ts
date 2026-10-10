import fs from 'node:fs';
import path from 'node:path';
import { browser } from '@wdio/globals';

// Writes one line of JSON per test ATTEMPT to reports/results/<worker>.jsonl.
// scripts/summarize-results.ts reads these files to build the CI summary
// (passed / failed / FLAKY / duration) and scripts/seeded-bug-report.ts uses them
// to work out which seeded bugs were caught.

export const RESULTS_DIR = path.join(process.cwd(), 'reports', 'results');

export interface ResultRecord {
  profile: string; // e.g. "chrome", "firefox", "iPhone 14 (emulated)"
  spec: string;
  title: string; // full title, e.g. "Room booking @regression calculates the price for Aurelle Tokyo"
  passed: boolean;
  attempt: number; // 0 = first run, 1 = first retry
  maxRetries: number;
  durationMs: number;
  error?: string;
}

/** A readable name for the browser/device this worker is testing. */
export function currentProfile(): string {
  const requested = browser.requestedCapabilities as Record<string, unknown>;
  return (requested['aurelle:profile'] as string) ?? String(requested.browserName ?? 'unknown');
}

export function recordResult(record: ResultRecord): void {
  fs.mkdirSync(RESULTS_DIR, { recursive: true });
  // One file per worker process, so parallel workers never write to the same file.
  const file = path.join(RESULTS_DIR, `${process.pid}.jsonl`);
  fs.appendFileSync(file, `${JSON.stringify(record)}\n`);
}
