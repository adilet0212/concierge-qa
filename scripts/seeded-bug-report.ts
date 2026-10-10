/**
 * "Does the suite catch real regressions?"
 *
 * Run the regression suite against the app started with BUG_MODE=on, then run this script.
 * It maps the failed tests to the six seeded bugs (test-data/seeded-bugs.json lists which
 * tests are expected to catch each bug) and prints a catch-rate table, e.g. "6/6 caught".
 *
 * Exit code 0 only if EVERY seeded bug made at least one test fail.
 */
import fs from 'node:fs';
import path from 'node:path';
import { finalResults, publishMarkdown } from './lib/results.ts';

interface SeededBug {
  id: number;
  title: string;
  caughtBy: string[]; // parts of test titles
}

const bugs: SeededBug[] = JSON.parse(fs.readFileSync(path.join(process.cwd(), 'test-data', 'seeded-bugs.json'), 'utf8'));
const results = finalResults();
const failed = results.filter((r) => !r.passed);

if (results.length === 0) {
  publishMarkdown('### Seeded-bug run\n\n❌ No test results found, so no bug could be caught. Did the test run start?\n');
  process.exit(1);
}

const rows: string[] = [];
const explained = new Set<string>();
let caughtCount = 0;

for (const bug of bugs) {
  const catchers = failed.filter((test) => bug.caughtBy.some((part) => test.title.includes(part)));
  catchers.forEach((test) => explained.add(test.title));
  if (catchers.length > 0) caughtCount += 1;

  const names = catchers.map((test) => test.title.replace(/ @\w+/g, '')).slice(0, 3);
  const more = catchers.length > 3 ? ` (+${catchers.length - 3} more)` : '';
  rows.push(`| ${bug.id} | ${bug.title} | ${catchers.length > 0 ? '✅ caught' : '❌ missed'} | ${names.join('<br>') || 'none'}${more} |`);
}

const allCaught = caughtCount === bugs.length;
const lines = [
  '### Seeded-bug run: does the suite catch real regressions?',
  '',
  `## ${allCaught ? '✅' : '❌'} ${caughtCount}/${bugs.length} seeded regressions caught`,
  '',
  `The app ran with \`BUG_MODE=on\`; ${failed.length} of ${results.length} tests failed, as they should.`,
  '',
  '| # | Seeded regression | Result | Caught by |',
  '|---|---|---|---|',
  ...rows,
];

const unexplained = failed.filter((test) => !explained.has(test.title));
if (unexplained.length > 0) {
  lines.push('', '**Other failures** (not mapped to a seeded bug; check for side effects or flakiness):', '');
  for (const test of unexplained) lines.push(`- ${test.title}`);
}

publishMarkdown(`${lines.join('\n')}\n`);
process.exit(allCaught ? 0 : 1);
