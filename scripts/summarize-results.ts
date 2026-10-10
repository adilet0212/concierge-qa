/**
 * Summarises the last test run: passed / failed / FLAKY / duration per browser profile,
 * then lists failed and flaky tests. In GitHub Actions the same markdown goes to the
 * job summary, so reviewers see results without downloading anything.
 *
 *   npx tsx scripts/summarize-results.ts "Regression (Chrome)"
 */
import { finalResults, formatDuration, publishMarkdown } from './lib/results.ts';

const title = process.argv[2] ?? 'Test results';
const results = finalResults();

if (results.length === 0) {
  publishMarkdown(`### ${title}\n\nNo test results were found (did the test run start?).\n`);
  process.exit(0);
}

const profiles = [...new Set(results.map((r) => r.profile))];
const lines = [
  `### ${title}`,
  '',
  '| Browser / device | Tests | ✅ Passed | ❌ Failed | ⚠️ Flaky | Time (sum of tests) |',
  '|---|---|---|---|---|---|',
];

for (const profile of profiles) {
  const forProfile = results.filter((r) => r.profile === profile);
  const failed = forProfile.filter((r) => !r.passed).length;
  const flaky = forProfile.filter((r) => r.flaky).length;
  const duration = forProfile.reduce((sum, r) => sum + r.durationMs, 0);
  lines.push(
    `| ${profile} | ${forProfile.length} | ${forProfile.length - failed} | ${failed} | ${flaky} | ${formatDuration(duration)} |`,
  );
}

const failures = results.filter((r) => !r.passed);
if (failures.length > 0) {
  lines.push('', '**Failed tests**', '');
  for (const f of failures) lines.push(`- ❌ \`${f.profile}\` ${f.title}: ${(f.error ?? '').split('\n')[0]}`);
}

const flakyTests = results.filter((r) => r.flaky);
if (flakyTests.length > 0) {
  lines.push('', '**FLAKY tests** (failed first, passed on retry; please investigate)', '');
  for (const f of flakyTests) lines.push(`- ⚠️ \`${f.profile}\` ${f.title}`);
}

publishMarkdown(`${lines.join('\n')}\n`);
