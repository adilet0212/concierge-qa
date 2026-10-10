// WebdriverIO config for the practice exercises only (plain JavaScript on purpose).
// The real framework config lives in tests/web/wdio.conf.ts.
// Run one exercise with:  npm run bug-hunt -- wdio-03   (start the app first: npm run app)
export const config = {
  runner: 'local',
  specs: ['./exercises/wdio-*/*.e2e.js'],
  maxInstances: 1,
  capabilities: [
    {
      browserName: 'chrome',
      // A desktop-sized window: some exercises depend on the desktop layout.
      'goog:chromeOptions': { args: ['--headless=new', '--window-size=1280,900'] },
    },
  ],
  baseUrl: process.env.BASE_URL ?? 'http://localhost:4300',
  logLevel: 'error',
  waitforTimeout: 5000,
  framework: 'mocha',
  reporters: ['spec'],
  mochaOpts: { ui: 'bdd', timeout: 30000 },
};
