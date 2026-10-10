import { BaseScreen } from './BaseScreen.ts';

export type Tab = 'Home' | 'Webview' | 'Login' | 'Forms' | 'Swipe';

/** The bottom tab bar, present on every screen of the demo app. */
class TabBar extends BaseScreen {
  tab(name: Tab) {
    return this.byAccessibilityId(name);
  }

  async open(name: Tab) {
    await this.tab(name).click();
  }
}

export default new TabBar();
