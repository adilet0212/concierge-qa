import fs from 'node:fs';
import os from 'node:os';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import allure from '@wdio/allure-reporter';
import { browser } from '@wdio/globals';
import { currentProfile, recordResult, RESULTS_DIR } from './support/results-recorder.ts';
import { BASE_URL } from './support/test-data.ts';

// WebdriverIO config for the web suite.
//   npm run test:smoke        -> tests tagged @smoke, Chrome
//   npm run test:regression   -> every test (all are tagged @regression), Chrome
//   npm run test:firefox      -> every test, Firefox
// Set HEADED=true to watch the browser, MAX_INSTANCES to change parallelism.

const here = path.dirname(fileURLToPath(import.meta.url));
const headless = process.env.HEADED !== 'true';
const browserName = process.env.BROWSER ?? 'chrome';
const WINDOW = { width: 1366, height: 900 };

/**
 * How many browsers to run at once when MAX_INSTANCES isn't set: one per 1.5 GB of memory,
 * between 1 and 5. Too many on a small laptop make it swap, tests pass the 60 s timeout, and a
 * timed-out test keeps running in the background into its own retry (docs/LEARN.md, story 5).
 */
function defaultMaxInstances(): number {
  const memoryGb = os.totalmem() / 1024 ** 3;
  return Math.min(5, Math.max(1, Math.floor(memoryGb / 1.5)));
}

export const chromeDesktop: WebdriverIO.Capabilities = {
  browserName: 'chrome',
  'goog:chromeOptions': {
    args: [
      ...(headless ? ['--headless=new'] : []),
      `--window-size=${WINDOW.width},${WINDOW.height}`,
      '--disable-dev-shm-usage', // CI containers have a small /dev/shm
      '--disable-search-engine-choice-screen',
    ],
  },
};

export const firefoxDesktop: WebdriverIO.Capabilities = {
  browserName: 'firefox',
  'moz:firefoxOptions': {
    args: [...(headless ? ['-headless'] : []), `--width=${WINDOW.width}`, `--height=${WINDOW.height}`],
  },
};

export const config: WebdriverIO.Config = {
  runner: 'local',
  tsConfigPath: path.join(here, '..', 'tsconfig.json'),
  specs: [path.join(here, 'specs', '*.spec.ts')],

  // Spec files run in parallel, one browser per worker. This is safe because every test
  // creates its own guest and data through the API (see support/api-client.ts).
  maxInstances: Number(process.env.MAX_INSTANCES ?? defaultMaxInstances()),
  capabilities: [browserName === 'firefox' ? firefoxDesktop : chromeDesktop],

  baseUrl: BASE_URL,
  logLevel: 'warn',
  outputDir: path.join(process.cwd(), 'reports', 'wdio-logs'),

  // Default time every auto-waiting command and `expect` matcher keeps retrying before failing.
  waitforTimeout: 10_000,
  connectionRetryTimeout: 120_000,
  connectionRetryCount: 2,

  framework: 'mocha',
  mochaOpts: {
    ui: 'bdd',
    timeout: 60_000,
    // Retry a failed test once. A test that only passes on the retry is reported as FLAKY
    // (see afterTest below and scripts/summarize-results.ts), so flakiness stays visible.
    retries: 1,
  },

  reporters: [
    'spec',
    [
      'allure',
      {
        outputDir: path.join(process.cwd(), 'reports', 'allure-results'),
        disableWebdriverStepsReporting: true,
        disableWebdriverScreenshotsReporting: true,
        reportedEnvironmentVars: { App: BASE_URL, Browser: browserName },
      },
    ],
  ],

  /** Runs once, before any browser starts. */
  async onPrepare() {
    const health = await fetch(`${BASE_URL}/api/health`).catch(() => undefined);
    if (!health?.ok) {
      throw new Error(`The Aurelle demo app is not running at ${BASE_URL}. Start it first with: npm run app`);
    }
    // Start from an empty database. Done ONCE here (not per test) because tests run in parallel.
    await fetch(`${BASE_URL}/api/test/reset`, { method: 'POST' });
    // Old result files would mix with this run's results in the summary.
    fs.rmSync(RESULTS_DIR, { recursive: true, force: true });
    fs.rmSync(path.join(process.cwd(), 'reports', 'allure-results'), { recursive: true, force: true });
  },

  /** Runs after every test attempt (including retries). */
  async afterTest(test, _context, result) {
    // Record the result first: if the browser has crashed, the screenshot below would throw.
    recordResult({
      profile: currentProfile(),
      spec: path.basename(test.file ?? ''),
      // `test.parent` is the describe() title, e.g. "Room booking @regression".
      title: [test.parent, test.title].filter(Boolean).join(' '),
      passed: result.passed,
      attempt: test._currentRetry ?? 0,
      maxRetries: test._retries ?? 0,
      durationMs: result.duration,
      error: result.passed ? undefined : String(result.error?.message ?? result.error ?? '').slice(0, 500),
    });
    if (!result.passed) {
      // Evidence for debugging, attached to the Allure report.
      await allure.addAttachment('Screenshot', Buffer.from(await browser.takeScreenshot(), 'base64'), 'image/png');
      await allure.addAttachment('Page source', await browser.getPageSource(), 'text/html');
      await allure.addAttachment('URL', await browser.getUrl(), 'text/plain');
    }
  },

  /**
   * Runs after every Mocha hook (beforeEach...). When a hook fails, Mocha skips the tests it
   * belongs to, so afterTest never runs for them. Recording the failed hook keeps the summary honest.
   */
  afterHook(test, _context, result) {
    if (!result.error) return;
    recordResult({
      profile: currentProfile(),
      spec: path.basename(test.file ?? ''),
      title: [test.parent, test.title].filter(Boolean).join(' '),
      passed: false,
      attempt: 0,
      maxRetries: 0,
      durationMs: result.duration,
      error: String(result.error.message ?? result.error).slice(0, 500),
    });
  },
};
