import { $, expect } from '@wdio/globals';
import { openAsNewGuest } from '../../support/aurelle.js';

describe('In-room dining cart', () => {
  it('shows quantity 1 after adding a dish', async () => {
    await openAsNewGuest('/properties/toronto/dining');

    // Fixed: await the click so it has finished before the next line runs.
    await $('[data-testid="add-club-sandwich"]').click();

    // Fixed: await the assertion. Without await, expect() returns a promise nobody checks,
    // so the test finished "green" before the assertion could fail.
    await expect($('[data-testid="cart-qty-club-sandwich"]')).toHaveText('1');
  });
});
