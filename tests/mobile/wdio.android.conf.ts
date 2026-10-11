import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import allure from '@wdio/allure-reporter';
import { browser } from '@wdio/globals';
import { recordResult, RESULTS_DIR } from '../web/support/results-recorder.ts';
import { DEMO_APP_PATH } from './demo-app.ts';

// Appium (native Android) suite against the WebdriverIO demo app.
//   npm run mobile:download-app   (once)
//   start an Android emulator     (see docs/MOBILE_SETUP.md)
//   npm run test:mobile
//
// How the pieces talk:  this test code -> WebdriverIO -> Appium server -> UiAutomator2 driver -> device.

const here = path.dirname(fileURLToPath(import.meta.url));
const deviceName = process.env.ANDROID_DEVICE_NAME ?? 'Android Emulator';
const profile = `Android (${deviceName}, native app)`; // label used in the CI summary

export const config: WebdriverIO.Config = {
  runner: 'local',
  tsConfigPath: path.join(here, '..', 'tsconfig.json'),
  specs: [path.join(here, 'specs', '*.spec.ts')],
  // One emulator can run one test session at a time.
  maxInstances: 1,

  // The Appium service starts the Appium server from node_modules before the tests and stops it
  // afterwards. The UiAutomator2 driver is a devDependency, so `npm install` installs it too.
  services: [
    [
      'appium',
      {
        args: { address: '127.0.0.1', port: 4723 },
        logPath: path.join(process.cwd(), 'reports'),
        // Appium can take 40+ seconds to load its driver on Windows (antivirus scanning
        // node_modules). The default 30 s limit is too short there.
        appiumStartTimeout: 120_000,
      },
    ],
  ],
  hostname: '127.0.0.1',
  port: 4723,

  capabilities: [
    {
      platformName: 'Android',
      'appium:automationName': 'UiAutomator2',
      'appium:deviceName': deviceName,
      'appium:app': DEMO_APP_PATH,
      'appium:autoGrantPermissions': true,
      'appium:newCommandTimeout': 240,
      // The first run installs the app (~120 MB) and Appium's helper apps on the device, and a
      // freshly booted emulator is slow. Generous timeouts avoid failing on a cold start.
      'appium:androidInstallTimeout': 300_000,
      'appium:uiautomator2ServerInstallTimeout': 120_000,
      'appium:uiautomator2ServerLaunchTimeout': 120_000,
      'appium:adbExecTimeout': 60_000,
    },
  ],

  logLevel: 'warn',
  outputDir: path.join(process.cwd(), 'reports', 'wdio-logs'),
  // Emulators are slower than browsers, especially in CI, so wait longer before failing.
  waitforTimeout: 20_000,
  connectionRetryTimeout: 300_000,
  connectionRetryCount: 1,

  framework: 'mocha',
  mochaOpts: { ui: 'bdd', timeout: 180_000, retries: 1 },

  reporters: [
    'spec',
    [
      'allure',
      {
        outputDir: path.join(process.cwd(), 'reports', 'allure-results'),
        disableWebdriverStepsReporting: true,
        disableWebdriverScreenshotsReporting: true,
        reportedEnvironmentVars: { Platform: 'Android', Device: deviceName },
      },
    ],
  ],

  onPrepare() {
    if (!fs.existsSync(DEMO_APP_PATH)) {
      throw new Error('The demo app is missing. Download it first with: npm run mobile:download-app');
    }
    fs.rmSync(RESULTS_DIR, { recursive: true, force: true });
    fs.rmSync(path.join(process.cwd(), 'reports', 'allure-results'), { recursive: true, force: true });
  },

  async afterTest(test, _context, result) {
    // Record the result first: if the session has died, the screenshot below would throw.
    recordResult({
      profile,
      spec: path.basename(test.file ?? ''),
      title: [test.parent, test.title].filter(Boolean).join(' '),
      passed: result.passed,
      attempt: test._currentRetry ?? 0,
      maxRetries: test._retries ?? 0,
      durationMs: result.duration,
      error: result.passed ? undefined : String(result.error?.message ?? result.error ?? '').slice(0, 500),
    });
    if (!result.passed) {
      await allure.addAttachment('Screenshot', Buffer.from(await browser.takeScreenshot(), 'base64'), 'image/png');
      await allure.addAttachment('Screen hierarchy (XML)', await browser.getPageSource(), 'application/xml');
    }
  },

  /** A failing beforeEach (e.g. restartApp) skips its tests, so record the hook itself. */
  afterHook(test, _context, result) {
    if (!result.error) return;
    recordResult({
      profile,
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
