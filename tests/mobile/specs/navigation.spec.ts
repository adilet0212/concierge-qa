import { expect } from '@wdio/globals';
import FormsScreen from '../screens/FormsScreen.ts';
import HomeScreen from '../screens/HomeScreen.ts';
import LoginScreen from '../screens/LoginScreen.ts';
import SwipeScreen from '../screens/SwipeScreen.ts';
import TabBar from '../screens/TabBar.ts';
import { restartApp } from '../support/app.ts';

describe('Navigation @regression', () => {
  beforeEach(restartApp);

  it('moves between screens with the tab bar @smoke', async () => {
    await expect(HomeScreen.screen).toBeDisplayed();

    await TabBar.open('Login');
    await expect(LoginScreen.screen).toBeDisplayed();

    await TabBar.open('Forms');
    await expect(FormsScreen.screen).toBeDisplayed();

    await TabBar.open('Swipe');
    await expect(SwipeScreen.screen).toBeDisplayed();

    await TabBar.open('Home');
    await expect(HomeScreen.screen).toBeDisplayed();
  });
});
