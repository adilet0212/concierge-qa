import { $, browser, expect } from '@wdio/globals';
import { BASE_URL } from '../../support/aurelle.js';

describe('Booking journey', () => {
  it('signs in', async () => {
    await browser.url('/sign-in');
    await $('[data-testid="signin-email"]').setValue('journey@aurelle.test');
    await $('[data-testid="signin-request-code"]').click();

    const inbox = await fetch(`${BASE_URL}/api/dev/inbox?email=journey@aurelle.test`).then((r) => r.json());
    await $('[data-testid="signin-code"]').setValue(inbox.code);
    await $('[data-testid="signin-verify"]').click();

    await expect($('[data-testid="header-guest-email"]')).toHaveText('journey@aurelle.test');
  });

  it('opens Aurelle Tokyo', async () => {
    await $('[data-testid="property-card-tokyo"]').click();
    await expect($('[data-testid="property-title"]')).toHaveText('Aurelle Tokyo');
  });

  it('starts a booking', async () => {
    await $('[data-testid="action-book"]').click();
    await expect($('[data-testid="booking-form"]')).toBeDisplayed();
  });
});
