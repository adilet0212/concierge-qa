import { $, $$ } from '@wdio/globals';

/**
 * Shared helpers for all page objects.
 * Rule: selectors live ONLY in page objects. Specs describe what the guest does
 * ("book a room"); page objects know how to find things on the screen.
 */
export class BasePage {
  /**
   * Every element we test has a data-testid attribute. Test ids don't change when the design,
   * the layout or the language changes, so they are the most stable kind of selector.
   */
  protected byTestId(testId: string) {
    return $(`[data-testid="${testId}"]`);
  }

  protected allByTestIdPrefix(prefix: string) {
    return $$(`[data-testid^="${prefix}"]`);
  }

  /** All visible text on the page; used to look for untranslated (raw) keys. */
  async visibleText(): Promise<string> {
    return $('body').getText();
  }

  /** The page's main heading. */
  get heading() {
    return $('main h1');
  }

  /** The <html> element; its lang attribute tells browsers and screen readers the page language. */
  get document() {
    return $('html');
  }
}
