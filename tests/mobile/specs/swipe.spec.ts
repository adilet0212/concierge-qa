import { expect } from '@wdio/globals';
import SwipeScreen from '../screens/SwipeScreen.ts';
import TabBar from '../screens/TabBar.ts';
import { restartApp } from '../support/app.ts';

describe('Swipe gestures @regression', () => {
  beforeEach(async () => {
    await restartApp();
    await TabBar.open('Swipe');
  });

  it('swipes the carousel to the next card', async () => {
    await expect(SwipeScreen.cardTitle('Fully Open Source')).toBeDisplayed();

    // A real touch gesture: finger down on the right of the card, move left, finger up.
    await SwipeScreen.swipeToNextCard();

    await expect(SwipeScreen.cardTitle('Great community')).toBeDisplayed();
  });
});
