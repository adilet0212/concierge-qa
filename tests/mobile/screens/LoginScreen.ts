import { BaseScreen } from './BaseScreen.ts';

export const LOGIN_ERRORS = {
  email: 'Please enter a valid email address',
  password: 'Please enter at least 8 characters',
  repeatPassword: 'Please enter the same password',
};

class LoginScreen extends BaseScreen {
  get screen() {
    return this.byAccessibilityId('Login-screen');
  }

  get loginTab() {
    return this.byAccessibilityId('button-login-container');
  }

  get signUpTab() {
    return this.byAccessibilityId('button-sign-up-container');
  }

  get emailInput() {
    return this.byAccessibilityId('input-email');
  }

  get passwordInput() {
    return this.byAccessibilityId('input-password');
  }

  get repeatPasswordInput() {
    return this.byAccessibilityId('input-repeat-password');
  }

  get loginButton() {
    return this.byAccessibilityId('button-LOGIN');
  }

  get signUpButton() {
    return this.byAccessibilityId('button-SIGN UP');
  }

  errorMessage(text: string) {
    return this.byText(text);
  }

  async logIn(email: string, password: string) {
    await this.loginTab.click();
    await this.emailInput.setValue(email);
    await this.passwordInput.setValue(password);
    await this.loginButton.click();
  }

  async signUp(email: string, password: string, repeatPassword: string) {
    await this.signUpTab.click();
    // The "repeat password" field only appears on the sign-up form (it animates in).
    await this.repeatPasswordInput.waitForDisplayed();
    await this.emailInput.setValue(email);
    await this.passwordInput.setValue(password);
    await this.repeatPasswordInput.setValue(repeatPassword);
    await this.signUpButton.click();
  }
}

export default new LoginScreen();
