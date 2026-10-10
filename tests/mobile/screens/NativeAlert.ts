import { BaseScreen } from './BaseScreen.ts';

/**
 * A native Android alert dialog (not part of the app's own UI, so it has no accessibility ids).
 * Android gives dialog parts fixed resource ids: alertTitle, message and up to three buttons:
 * button1 = positive (e.g. OK), button2 = negative (e.g. Cancel), button3 = neutral.
 */
class NativeAlert extends BaseScreen {
  get title() {
    return this.byResourceId('android:id/alertTitle');
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
