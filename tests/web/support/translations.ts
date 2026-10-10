import type { BasePage } from '../pageobjects/BasePage.ts';
import { translationKeys } from './test-data.ts';

/**
 * Translation keys (like "booking.confirm.title") that are visible on the page.
 * The app shows the raw key when a translation is missing, so any key on screen means
 * a guest is seeing an untranslated label. An empty list is what we want.
 */
export async function rawTranslationKeys(page: BasePage): Promise<string[]> {
  const text = await page.visibleText();
  return translationKeys.filter((key) => text.includes(key));
}
