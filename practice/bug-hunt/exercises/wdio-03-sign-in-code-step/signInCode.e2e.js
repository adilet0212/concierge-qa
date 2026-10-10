import { $, browser, expect } from '@wdio/globals';
import { uniqueEmail } from '../../support/aurelle.js';

describe('Sign in', () => {
  it('asks for the one-time code after the guest enters their email', async () => {
    await browser.url('/sign-in');

    await $('form input').setValue(uniqueEmail());
    await $('button*=Send').click();

    await expect($('[data-testid="signin-code-input"]')).toBeDisplayed();
  });
});
