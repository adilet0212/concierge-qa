import { $, expect } from '@wdio/globals';
import { openAsNewGuest } from '../../support/aurelle.js';

describe('Header on desktop', () => {
  it('does not show the mobile menu button on a desktop screen', async () => {
    await openAsNewGuest('/');

    // Fixed: the button is always in the DOM and CSS hides it on wide screens.
    // isExisting() asks "is it in the DOM?"; the requirement is "can the guest see it?",
    // which is what toBeDisplayed() checks.
    await expect($('[data-testid="menu-toggle"]')).not.toBeDisplayed();
  });
});
