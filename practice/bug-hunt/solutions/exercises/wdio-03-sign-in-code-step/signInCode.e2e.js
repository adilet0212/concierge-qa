import { $, browser, expect } from '@wdio/globals';
import { uniqueEmail } from '../../support/aurelle.js';

describe('Sign in', () => {
  it('asks for the one-time code after the guest enters their email', async () => {
    await browser.url('/sign-in');

    // Fixed: data-testid selectors don't depend on page structure ("form input")
    // or on visible text ("Send"), which changes in French and Japanese.
    await $('[data-testid="signin-email"]').setValue(uniqueEmail());
    await $('[data-testid="signin-request-code"]').click();

    // Fixed: the real test id is "signin-code" (checked in DevTools).
    await expect($('[data-testid="signin-code"]')).toBeDisplayed();
  });
});
