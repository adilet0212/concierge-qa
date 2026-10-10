import { $, browser, expect } from '@wdio/globals';
import { createBooking, openAsNewGuest } from '../../support/aurelle.js';

describe('Booking confirmation', () => {
  it('shows the confirmation heading', async () => {
    const guest = await openAsNewGuest('/');
    const booking = await createBooking(guest.token, 'toronto');
    await browser.url(`/bookings/${booking.reference}`);

    // Fixed: compare the element's TEXT, not the element object itself.
    // toHaveText also waits for the text to appear, so it is never too early.
    await expect($('[data-testid="confirmation-title"]')).toHaveText('Your stay is confirmed');
  });
});
