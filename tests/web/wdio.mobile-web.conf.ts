import { config as webConfig } from './wdio.conf.ts';

// Mobile web: the same specs, in Chrome's built-in mobile emulation (phone-sized viewport,
// touch events, mobile user agent). Fast and runs anywhere; it does not replace a check on
// real devices (see docs/TEST_STRATEGY.md), but it catches layout and responsive bugs early.
//   npm run test:mobile-web   -> @smoke tests on both profiles

const headlessArgs = process.env.HEADED === 'true' ? [] : ['--headless=new'];

function emulatedPhone(profile: string, width: number, height: number, pixelRatio: number, userAgent: string): WebdriverIO.Capabilities {
  return {
    browserName: 'chrome',
    // Our own label for reports (any "vendor:name" capability is allowed and ignored by the driver).
    'aurelle:profile': profile,
    'goog:chromeOptions': {
      args: [...headlessArgs, '--disable-dev-shm-usage'],
      mobileEmulation: { deviceMetrics: { width, height, pixelRatio, touch: true, mobile: true }, userAgent },
    },
  } as WebdriverIO.Capabilities;
}

const iPhone = emulatedPhone(
  'iPhone 14 size (Chrome emulation)',
  390,
  844,
  3,
  'Mozilla/5.0 (iPhone; CPU iPhone OS 17_0 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/17.0 Mobile/15E148 Safari/604.1',
);

const pixel = emulatedPhone(
  'Pixel 7 size (Chrome emulation)',
  412,
  915,
  2.625,
  'Mozilla/5.0 (Linux; Android 14; Pixel 7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/130.0.0.0 Mobile Safari/537.36',
);

export const config: WebdriverIO.Config = {
  ...webConfig,
  capabilities: [iPhone, pixel],
};
