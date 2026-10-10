import { $, expect } from '@wdio/globals';
import { listOrders, openAs, signInViaApi, uniqueEmail } from '../../support/aurelle.js';

describe('Order history', () => {
  let guest;

  beforeEach(async () => {
    // Fixed 1: a brand-new guest for every test. No other spec file knows this email,
    // so nothing running in parallel can add orders to it.
    // Fixed 2: no global reset here. Wiping the whole server deleted the sessions and
    // bookings of tests running in other workers. Reset once before the run, if at all.
    guest = await signInViaApi(uniqueEmail('orders'));
  });

  it('contains exactly one order after the guest orders once', async () => {
    await openAs(guest, '/properties/toronto/dining');
    await $('[data-testid="add-club-sandwich"]').click();
    await $('[data-testid="place-order"]').click();
    await expect($('[data-testid="order-status"]')).toBeDisplayed();

    const orders = await listOrders(guest.token);
    expect(orders).toHaveLength(1);
  });
});
