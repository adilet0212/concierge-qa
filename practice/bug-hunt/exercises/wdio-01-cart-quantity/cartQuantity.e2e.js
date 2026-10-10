import { $, expect } from '@wdio/globals';
import { openAsNewGuest } from '../../support/aurelle.js';

describe('In-room dining cart', () => {
  it('shows quantity 1 after adding a dish', async () => {
    await openAsNewGuest('/properties/toronto/dining');

    $('[data-testid="add-club-sandwich"]').click();

    expect($('[data-testid="cart-qty-club-sandwich"]')).toHaveText('1');
  });
});
