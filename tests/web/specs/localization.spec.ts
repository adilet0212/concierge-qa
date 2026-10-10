import { browser, expect } from '@wdio/globals';
import ConfirmationPage from '../pageobjects/ConfirmationPage.ts';
import PropertiesPage from '../pageobjects/PropertiesPage.ts';
import SignInPage from '../pageobjects/SignInPage.ts';
import { api, type Guest } from '../support/api-client.ts';
import { futureStay } from '../support/dates.ts';
import { openAs, openSignedOut } from '../support/session.ts';
import { locales, property } from '../support/test-data.ts';
import { rawTranslationKeys } from '../support/translations.ts';

/** Books a stay through the API so a test can open its confirmation page. */
async function bookStay(guest: Guest) {
  const tokyo = property('tokyo');
  const stay = futureStay(tokyo.timeZone, 50, 2);
  return api.createBooking(guest, { propertyId: tokyo.id, roomTypeId: tokyo.testRoom.id, ...stay, adults: 2 });
}

// Data-driven: one set of tests per language in test-data/locales.json.
describe('Localization @regression', () => {
  for (const locale of locales) {
    it(`${locale.code}: the sign-in page is translated`, async () => {
      await openSignedOut('/sign-in', locale.code);

      await expect(SignInPage.title).toHaveText(locale.signInTitle);
      await expect(SignInPage.document).toHaveAttribute('lang', locale.code);
      expect(await rawTranslationKeys(SignInPage)).toEqual([]);
    });

    it(`${locale.code}: the booking confirmation is translated`, async () => {
      const guest = await api.createGuest('l10n');
      const booking = await bookStay(guest);

      await openAs(guest, `/bookings/${booking.reference}`, locale.code);

      await expect(ConfirmationPage.title).toHaveText(locale.confirmationTitle);
      expect(await rawTranslationKeys(ConfirmationPage)).toEqual([]);
    });

    it(`${locale.code}: key screens show no raw translation keys`, async () => {
      const guest = await api.createGuest('screens');
      const booking = await bookStay(guest);
      const screens = [
        '/',
        '/properties/paris',
        '/properties/paris/book',
        '/properties/paris/dining',
        '/properties/paris/requests',
        '/properties/paris/chat',
        `/bookings/${booking.reference}`,
      ];

      await openAs(guest, screens[0], locale.code);
      await expect(PropertiesPage.title).toHaveText(locale.propertiesTitle);

      const problems: string[] = [];
      for (const screen of screens) {
        await browser.url(screen);
        await expect(PropertiesPage.heading).toBeDisplayed(); // wait until the screen has loaded
        const keys = await rawTranslationKeys(PropertiesPage);
        if (keys.length > 0) problems.push(`${screen}: ${keys.join(', ')}`);
      }
      // Collect every problem first, so one run shows all untranslated screens at once.
      expect(problems).toEqual([]);
    });
  }
});
