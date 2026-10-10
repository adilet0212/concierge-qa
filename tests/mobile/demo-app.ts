import path from 'node:path';

// The official WebdriverIO native demo app (React Native / Expo), used as the app under test
// for the Appium suite. Downloaded by `npm run mobile:download-app`, never committed.
export const DEMO_APP_VERSION = '2.2.0';
export const DEMO_APP_FILE = `android.wdio.native.app.v${DEMO_APP_VERSION}.apk`;
export const DEMO_APP_URL = `https://github.com/webdriverio/native-demo-app/releases/download/v${DEMO_APP_VERSION}/${DEMO_APP_FILE}`;
export const DEMO_APP_PATH = path.join(process.cwd(), 'apps', DEMO_APP_FILE);
export const DEMO_APP_PACKAGE = 'com.wdiodemoapp';
