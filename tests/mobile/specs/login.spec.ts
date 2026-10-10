import { expect } from '@wdio/globals';
import LoginScreen, { LOGIN_ERRORS } from '../screens/LoginScreen.ts';
import NativeAlert from '../screens/NativeAlert.ts';
import TabBar from '../screens/TabBar.ts';
import { restartApp } from '../support/app.ts';

describe('Login and sign-up form @regression', () => {
  beforeEach(async () => {
    await restartApp();
    await TabBar.open('Login');
  });

  it('logs in with valid details and confirms with a native alert @smoke', async () => {
    await LoginScreen.logIn('guest@aurelle.test', 'Password123');

    // The app answers with a native Android dialog, outside the app's own UI.
    await NativeAlert.waitForShown();
    await expect(NativeAlert.title).toHaveText('Success');
    await expect(NativeAlert.message).toHaveText('You are logged in!');

    await NativeAlert.accept();
    await expect(NativeAlert.title).not.toBeDisplayed();
  });

  it('shows validation errors for an invalid email and a short password', async () => {
    await LoginScreen.logIn('not-an-email', 'short');

    await expect(LoginScreen.errorMessage(LOGIN_ERRORS.email)).toBeDisplayed();
    await expect(LoginScreen.errorMessage(LOGIN_ERRORS.password)).toBeDisplayed();
    await expect(NativeAlert.title).not.toBeDisplayed();
  });

  it('signs up a new user', async () => {
    await LoginScreen.signUp('new.guest@aurelle.test', 'Password123', 'Password123');

    await NativeAlert.waitForShown();
    await expect(NativeAlert.title).toHaveText('Signed Up!');
    await expect(NativeAlert.message).toHaveText('You successfully signed up!');
    await NativeAlert.accept();
  });

  it('rejects a sign-up when the passwords do not match', async () => {
    await LoginScreen.signUp('new.guest@aurelle.test', 'Password123', 'Different456');

    await expect(LoginScreen.errorMessage(LOGIN_ERRORS.repeatPassword)).toBeDisplayed();
    await expect(NativeAlert.title).not.toBeDisplayed();
  });
});
