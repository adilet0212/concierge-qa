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
}

export default new FormsScreen();
