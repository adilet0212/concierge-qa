import { $, browser, expect } from '@wdio/globals';
import { BASE_URL, openAsNewGuest, uniqueEmail } from '../../support/aurelle.js';

// Fixed: every test creates its own guest and opens its own starting page, so each one
// can run alone, in any order, and be retried. Only the sign-in test uses the sign-in UI;
// the others sign in through the API because sign-in is not what they are testing.
describe('Booking journey', () => {
  it('signs in', async () => {
    const email = uniqueEmail('journey');
    await browser.url('/sign-in');
    await $('[data-testid="signin-email"]').setValue(email);
    await $('[data-testid="signin-request-code"]').click();

    const inbox = await fetch(`${BASE_URL}/api/dev/inbox?email=${encodeURIComponent(email)}`).then((r) => r.json());
    await $('[data-testid="signin-code"]').setValue(inbox.code);
    await $('[data-testid="signin-verify"]').click();

    await expect($('[data-testid="header-guest-email"]')).toHaveText(email);
  });

  it('opens Aurelle Tokyo', async () => {
    await openAsNewGuest('/');
    await $('[data-testid="property-card-tokyo"]').click();
    await expect($('[data-testid="property-title"]')).toHaveText('Aurelle Tokyo');
  });

  it('starts a booking', async () => {
    await openAsNewGuest('/properties/tokyo');
    await $('[data-testid="action-book"]').click();
    await expect($('[data-testid="booking-form"]')).toBeDisplayed();
  });
});
