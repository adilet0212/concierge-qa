import { $, expect } from '@wdio/globals';
import { listOrders, openAs, resetAllData, signInViaApi } from '../../support/aurelle.js';

const GUEST_EMAIL = 'qa.guest@aurelle.test';

describe('Order history', () => {
  let guest;

  beforeEach(async () => {
    // Start every test from a clean slate
    await resetAllData();
    guest = await signInViaApi(GUEST_EMAIL);
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
