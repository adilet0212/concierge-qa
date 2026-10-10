import { BasePage } from './BasePage.ts';

class SignInPage extends BasePage {
  get title() {
    return this.byTestId('signin-title');
  }

  get emailInput() {
    return this.byTestId('signin-email');
  }

  get sendCodeButton() {
    return this.byTestId('signin-request-code');
  }

  get codeInput() {
    return this.byTestId('signin-code');
  }

  get signInButton() {
    return this.byTestId('signin-verify');
  }

  get errorMessage() {
    return this.byTestId('signin-error');
  }

  async requestCode(email: string) {
    await this.emailInput.setValue(email);
    await this.sendCodeButton.click();
    // The code field only appears after the server accepted the email, so wait for it
    // before the test continues (otherwise the next step could run too early).
    await this.codeInput.waitForDisplayed();
  }

  async typeCode(code: string) {
    await this.codeInput.setValue(code);
  }

  async submitCode(code: string) {
    await this.typeCode(code);
    await this.signInButton.click();
  }
}

export default new SignInPage();
