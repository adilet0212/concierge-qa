import { $, browser, expect } from '@wdio/globals';
import { openAsNewGuest } from '../../support/aurelle.js';

describe('Order status', () => {
  it('shows a new order as received', async () => {
    await openAsNewGuest('/properties/paris/dining');
    await $('[data-testid="add-caesar-salad"]').click();
    await $('[data-testid="place-order"]').click();

    // The order page takes a moment to load
    await browser.pause(5000);

    const status = await $('[data-testid="order-status"]').getText();
    expect(status).toBe('Received');
  });
});
