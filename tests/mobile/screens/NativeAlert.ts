import { DEMO_APP_PACKAGE } from '../demo-app.ts';
import { BaseScreen } from './BaseScreen.ts';

/**
 * A native Android alert dialog (not part of the app's own UI, so it has no accessibility ids).
 * Android gives dialog parts fixed resource ids: message and up to three buttons:
 * button1 = positive (e.g. OK), button2 = negative (e.g. Cancel), button3 = neutral.
 *
 * The title is the exception. React Native shows alerts with the AndroidX (AppCompat) dialog,
 * and its title id belongs to the app's own package (`<package>:id/alert_title`), not to Android
 * (`android:id/alertTitle`, used by the older platform dialog). The screen hierarchy (XML)
 * attached to a failing run is how to check which ids a dialog really has.
 */
class NativeAlert extends BaseScreen {
  get title() {
    return this.byResourceId(`${DEMO_APP_PACKAGE}:id/alert_title`);
  }

  get message() {
    return this.byResourceId('android:id/message');
  }

  get positiveButton() {
    return this.byResourceId('android:id/button1');
  }

  get negativeButton() {
    return this.byResourceId('android:id/button2');
  }

  /** The app shows some alerts after a short delay, so wait for the dialog explicitly. */
  async waitForShown() {
    await this.title.waitForDisplayed();
  }

  async accept() {
    await this.positiveButton.click();
  }

  async dismiss() {
    await this.negativeButton.click();
  }
}

export default new NativeAlert();
