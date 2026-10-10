/**
 * Builds the landing page of the published test reports (GitHub Pages).
 * Each CI suite gets its own Allure report in reports/pages/<suite>/; this page links them
 * and shows the headline numbers from each report's summary.json.
 *
 *   npx tsx scripts/build-pages-index.ts
 */
import fs from 'node:fs';
import path from 'node:path';

const pagesDir = path.join(process.cwd(), 'reports', 'pages');

const SUITES: Record<string, string> = {
  'smoke-chrome': 'Smoke (Chrome)',
  'regression-chrome': 'Regression (Chrome)',
  'regression-firefox': 'Regression (Firefox)',
  'mobile-web-iphone': 'Mobile web smoke (iPhone size, Chrome emulation)',
  'mobile-web-pixel': 'Mobile web smoke (Pixel size, Chrome emulation)',
  android: 'Android native app (Appium + UiAutomator2)',
  'seeded-bugs': 'Seeded-bug run: failures are EXPECTED (it proves the suite catches regressions)',
};

interface Summary {
  stats: Record<string, number>;
  flakyTests?: unknown[];
  duration?: number;
}

const escape = (text: string) => text.replace(/[&<>"]/g, (c) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' })[c]!);

const rows = Object.entries(SUITES)
  .filter(([folder]) => fs.existsSync(path.join(pagesDir, folder, 'summary.json')))
  .map(([folder, label]) => {
    const summary = JSON.parse(fs.readFileSync(path.join(pagesDir, folder, 'summary.json'), 'utf8')) as Summary;
    const { total = 0, passed = 0, failed = 0, broken = 0 } = summary.stats;
    const problems = failed + broken;
    const flaky = summary.flakyTests?.length ?? 0;
    const status = folder === 'seeded-bugs' ? 'expected' : problems === 0 ? 'ok' : 'fail';
    return `<tr class="${status}"><td><a href="${folder}/">${escape(label)}</a></td><td>${total}</td><td>${passed}</td><td>${problems}</td><td>${flaky}</td></tr>`;
  });

const repo = process.env.GITHUB_REPOSITORY;
const runLink = repo
  ? `<a href="${process.env.GITHUB_SERVER_URL}/${repo}/actions/runs/${process.env.GITHUB_RUN_ID}">CI run #${process.env.GITHUB_RUN_NUMBER}</a> · commit <code>${(process.env.GITHUB_SHA ?? '').slice(0, 7)}</code> · `
  : '';

const html = `<!doctype html>
<html lang="en">
<head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width, initial-scale=1">
<title>Concierge QA test reports</title>
<style>
  :root { --bg: #f7f4ee; --text: #1c1f1d; --muted: #4f5a54; --card: #fff; --border: #dcd3c2; --ok: #1d6537; --fail: #9f2418; --link: #1e4a3a; }
  @media (prefers-color-scheme: dark) { :root { --bg: #121614; --text: #e9ece9; --muted: #aab3ad; --card: #1b201d; --border: #33403a; --ok: #6fcf8f; --fail: #ff8a7a; --link: #9fd6bb; } }
  body { margin: 0; padding: 24px 16px; background: var(--bg); color: var(--text); font: 16px/1.5 system-ui, sans-serif; }
  main { max-width: 900px; margin: 0 auto; }
  h1 { font-family: Georgia, serif; margin-bottom: 4px; }
  p { color: var(--muted); }
  a { color: var(--link); }
  .table { overflow-x: auto; background: var(--card); border: 1px solid var(--border); border-radius: 10px; }
  table { width: 100%; border-collapse: collapse; }
  th, td { padding: 10px 12px; text-align: left; border-bottom: 1px solid var(--border); }
  td:not(:first-child), th:not(:first-child) { text-align: right; white-space: nowrap; }
  tr.ok td:first-child { border-left: 4px solid var(--ok); }
  tr.fail td:first-child { border-left: 4px solid var(--fail); }
  tr.expected td:first-child { border-left: 4px dashed var(--muted); }
</style>
</head>
<body>
<main>
  <h1>Concierge QA test reports</h1>
  <p>${runLink}generated ${new Date().toUTCString()}</p>
  <p>WebdriverIO + Appium tests for Aurelle Hotels &amp; Resorts, a fictional hotel guest app. One Allure report per suite.</p>
  <div class="table">
    <table>
      <thead><tr><th>Suite</th><th>Tests</th><th>Passed</th><th>Failed</th><th>Flaky</th></tr></thead>
      <tbody>${rows.join('\n')}</tbody>
    </table>
  </div>
</main>
</body>
</html>
`;

fs.mkdirSync(pagesDir, { recursive: true });
fs.writeFileSync(path.join(pagesDir, 'index.html'), html);
console.log(`Wrote reports/pages/index.html with ${rows.length} suite(s).`);
