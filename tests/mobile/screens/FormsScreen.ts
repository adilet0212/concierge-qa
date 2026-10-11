import { BaseScreen } from './BaseScreen.ts';

class FormsScreen extends BaseScreen {
  get screen() {
    return this.byAccessibilityId('Forms-screen');
  }

  get textInput() {
    return this.byAccessibilityId('text-input');
  }

  /** Shows whatever was typed into the text input. */
  get typedTextResult() {
    return this.byAccessibilityId('input-text-result');
  }

  get switch() {
    return this.byAccessibilityId('switch');
  }

  /** "Click to turn the switch ON" or "... OFF". */
  get switchLabel() {
    return this.byAccessibilityId('switch-text');
  }

  get activeButton() {
    return this.byAccessibilityId('button-Active');
  }

  /**
   * The Active button sits below the dropdown. On a small screen it is off-screen, and Android
   * only reports views that are on screen, so the button can't be found until we scroll to it.
   * `scrollIntoView` swipes inside the form (direction 'up' = finger moves up, content moves
   * up) until the button is displayed, then we tap it.
   */
  async tapActiveButton() {
    // Unlike most commands, scrollIntoView does not auto-wait (it exists to find elements that
    // are NOT on screen yet). Right after a tab change the form may still be rendering, so wait
    // for it first and hand scrollIntoView the found element.
    await this.screen.waitForDisplayed();
    const form = await this.screen;
    await this.activeButton.scrollIntoView({ direction: 'up', scrollableElement: form });
    await this.activeButton.click();
  }
}

export default new FormsScreen();
