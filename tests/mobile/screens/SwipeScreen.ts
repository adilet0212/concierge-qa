import { browser } from '@wdio/globals';
import { BaseScreen } from './BaseScreen.ts';

/** A horizontal carousel of cards; each card's title is shown in capitals. */
class SwipeScreen extends BaseScreen {
  get screen() {
    return this.byAccessibilityId('Swipe-screen');
  }

  /** The first card is a good "scrollable element" to swipe within. */
  get firstCard() {
    return this.byAccessibilityId('card');
  }

  cardTitle(title: string) {
    return this.byText(title.toUpperCase());
  }

  /** Swipes the carousel from right to left, which shows the next card. */
  async swipeToNextCard() {
    await browser.swipe({ direction: 'left', scrollableElement: this.firstCard, percent: 0.8 });
  }
}

export default new SwipeScreen();
