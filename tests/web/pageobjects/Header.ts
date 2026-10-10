import { BasePage } from './BasePage.ts';

/** The site header, present on every page (a "component object" rather than a page). */
class Header extends BasePage {
  get menuToggle() {
    return this.byTestId('menu-toggle');
  }

  get languageSelect() {
    return this.byTestId('language-select');
  }

  get guestEmail() {
    return this.byTestId('header-guest-email');
  }

  get signOutButton() {
    return this.byTestId('signout-button');
  }

  /**
   * On phone-sized screens the header items hide behind a menu button. Opening it only when
   * the button is visible lets the same test run on desktop and on mobile.
   */
  async openMenuIfCollapsed() {
    const isCollapsed = (await this.menuToggle.isDisplayed()) && (await this.menuToggle.getAttribute('aria-expanded')) === 'false';
    if (isCollapsed) await this.menuToggle.click();
  }

  async signOut() {
    await this.openMenuIfCollapsed();
    await this.signOutButton.click();
  }

  async chooseLanguage(code: string) {
    await this.openMenuIfCollapsed();
    await this.languageSelect.selectByAttribute('value', code);
  }
}

export default new Header();
