import { expect } from '@wdio/globals';
import FormsScreen from '../screens/FormsScreen.ts';
import NativeAlert from '../screens/NativeAlert.ts';
import TabBar from '../screens/TabBar.ts';
import { restartApp } from '../support/app.ts';

describe('Form components @regression', () => {
  beforeEach(async () => {
    await restartApp();
    await TabBar.open('Forms');
  });

  it('shows what was typed and toggles the switch', async () => {
    await FormsScreen.textInput.setValue('Late checkout at 2pm');
    await expect(FormsScreen.typedTextResult).toHaveText('Late checkout at 2pm');

    await expect(FormsScreen.switchLabel).toHaveText('Click to turn the switch ON');
    await FormsScreen.switch.click();
    await expect(FormsScreen.switchLabel).toHaveText('Click to turn the switch OFF');
  });

  it('opens an alert with three choices and dismisses it', async () => {
    await FormsScreen.activeButton.click();

    await NativeAlert.waitForShown();
    await expect(NativeAlert.title).toHaveText('This button is');
    await expect(NativeAlert.message).toHaveText('This button is active');

    await NativeAlert.dismiss(); // "Cancel"
    await expect(NativeAlert.title).not.toBeDisplayed();
    await expect(FormsScreen.screen).toBeDisplayed();
  });
});
