import { browser } from '@wdio/globals';
import { DEMO_APP_PACKAGE } from '../demo-app.ts';
import HomeScreen from '../screens/HomeScreen.ts';

/**
 * Closes and reopens the app, so every test starts from the home screen with empty forms.
 * Faster than reinstalling, and no state leaks from one test into the next.
 */
export async function restartApp() {
  await browser.terminateApp(DEMO_APP_PACKAGE);
  await browser.activateApp(DEMO_APP_PACKAGE);
  await HomeScreen.screen.waitForDisplayed();
}
