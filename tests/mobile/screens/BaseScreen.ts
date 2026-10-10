import { $ } from '@wdio/globals';

/**
 * Shared helpers for screen objects (the mobile version of page objects).
 *
 * Locator choice, best first:
 *   1. Accessibility id (`~id`). On Android it reads the element's content-description, on iOS
 *      its accessibilityIdentifier. It is cross-platform, fast (no XPath tree walk), set on
 *      purpose by developers, and unaffected by layout or text changes. Like data-testid on the web.
 *   2. Android resource id (`id=...`), for system UI such as native alert dialogs.
 *   3. UiAutomator text match, only for text we actually want to check (e.g. an error message).
 * XPath works too, but it is slow on mobile and breaks when the layout changes.
 */
export class BaseScreen {
  protected byAccessibilityId(id: string) {
    return $(`~${id}`);
  }

  protected byText(text: string) {
    return $(`android=new UiSelector().text("${text}")`);
  }

  protected byResourceId(id: string) {
    return $(`id=${id}`);
  }
}
