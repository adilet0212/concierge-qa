import { $, expect } from '@wdio/globals';
import { openAsNewGuest } from '../../support/aurelle.js';

describe('Header on desktop', () => {
  it('does not show the mobile menu button on a desktop screen', async () => {
    await openAsNewGuest('/');

    const menuButton = await $('[data-testid="menu-toggle"]');
    expect(await menuButton.isExisting()).toBe(false);
  });
});
