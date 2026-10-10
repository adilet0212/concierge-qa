import { browser, expect } from '@wdio/globals';
import DiningPage from '../pageobjects/DiningPage.ts';
import Header from '../pageobjects/Header.ts';
import PropertyPage from '../pageobjects/PropertyPage.ts';
import { api } from '../support/api-client.ts';
import { openAs } from '../support/session.ts';
import { locales, properties } from '../support/test-data.ts';
import { rawTranslationKeys } from '../support/translations.ts';

// Every property x every language, generated from test-data/*.json.
// 5 properties x 3 languages = 15 tests today. Adding a property or a language is a
// one-line JSON change, and the new combinations are tested with no new test code.
describe('Every property in every language @regression', () => {
  for (const hotel of properties) {
    for (const locale of locales) {
      it(`${hotel.name} in ${locale.name}: shows local time, currency and translated text`, async () => {
        const guest = await api.createGuest('matrix');
        await openAs(guest, `/properties/${hotel.id}`, locale.code);

        await expect(PropertyPage.title).toHaveText(hotel.name);
        await expect(PropertyPage.localTime).toHaveAttribute('data-time-zone', hotel.timeZone);
        await expect(PropertyPage.localTime).toHaveText(/\d{1,2}:\d{2}/);
        await expect(PropertyPage.currency).toHaveText(hotel.currency);
        await expect(Header.languageSelect).toHaveValue(locale.code);
        expect(await rawTranslationKeys(PropertyPage)).toEqual([]);

        // The dining menu is priced in the property's own currency, whatever the guest's language.
        await browser.url(`/properties/${hotel.id}/dining`);
        const firstDish = hotel.testOrder[0];
        await expect(DiningPage.menuPrice(firstDish.dishId)).toHaveAttribute('data-currency', hotel.currency);
        await expect(DiningPage.menuPrice(firstDish.dishId)).toHaveAttribute('data-amount', String(firstDish.price));
        expect(await rawTranslationKeys(DiningPage)).toEqual([]);
      });
    }
  }
});
