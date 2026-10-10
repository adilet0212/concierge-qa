import { $, browser, expect } from '@wdio/globals';
import { createBooking, openAsNewGuest } from '../../support/aurelle.js';

describe('Booking confirmation', () => {
  it('shows the confirmation heading', async () => {
    const guest = await openAsNewGuest('/');
    const booking = await createBooking(guest.token, 'toronto');
    await browser.url(`/bookings/${booking.reference}`);

    const heading = await $('[data-testid="confirmation-title"]');
    expect(heading).toEqual('Your stay is confirmed');
  });
});
