import { $, expect } from '@wdio/globals';
import { openAsNewGuest } from '../../support/aurelle.js';

describe('Order status', () => {
  it('shows a new order as received', async () => {
    await openAsNewGuest('/properties/paris/dining');
    await $('[data-testid="add-caesar-salad"]').click();
    await $('[data-testid="place-order"]').click();

    // Fixed: no fixed pause. toHaveText keeps retrying until the text matches (up to
    // waitforTimeout), so the test moves on as soon as the page is ready and waits
    // longer only when the machine is slow.
    await expect($('[data-testid="order-status"]')).toHaveText('Received');
  });
});
