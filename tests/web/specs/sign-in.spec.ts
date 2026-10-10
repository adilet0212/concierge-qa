import { browser, expect } from '@wdio/globals';
import Header from '../pageobjects/Header.ts';
import PropertiesPage from '../pageobjects/PropertiesPage.ts';
import SignInPage from '../pageobjects/SignInPage.ts';
import { api, apiRequest, uniqueEmail } from '../support/api-client.ts';
import { openAs, openSignedOut } from '../support/session.ts';

/** Signs in through the real UI (only the sign-in tests do this; other tests sign in through the API). */
async function signInThroughUi(email: string) {
  await openSignedOut('/sign-in');
  await SignInPage.requestCode(email);
  const code = await api.readCode(email); // the dev inbox, like a test mailbox
  await SignInPage.typeCode(code);
  // The field must accept every digit the server sent.
  await expect(SignInPage.codeInput).toHaveValue(code);
  await SignInPage.signInButton.click();
}

describe('Sign-in @regression', () => {
  it('signs in with the emailed one-time code @smoke', async () => {
    const email = uniqueEmail('signin');

    await signInThroughUi(email);

    await expect(PropertiesPage.title).toBeDisplayed();
    await Header.openMenuIfCollapsed();
    await expect(Header.guestEmail).toHaveText(email);
  });

  it('rejects a wrong code', async () => {
    const email = uniqueEmail('wrongcode');
    await openSignedOut('/sign-in');
    await SignInPage.requestCode(email);
    const realCode = await api.readCode(email);
    const wrongCode = String((Number(realCode) + 1) % 1_000_000).padStart(6, '0');

    await SignInPage.submitCode(wrongCode);

    await expect(SignInPage.errorMessage).toHaveText('That code is incorrect.');
    await expect(browser).toHaveUrl('/sign-in', { containing: true });
  });

  it('rejects an expired code', async () => {
    const email = uniqueEmail('expired');
    await openSignedOut('/sign-in');
    await SignInPage.requestCode(email);
    const code = await api.readCode(email);
    // Codes live 10 minutes. Instead of waiting, a test endpoint expires it right away.
    await api.expireCode(email);

    await SignInPage.submitCode(code);

    await expect(SignInPage.errorMessage).toHaveText('This code has expired. Request a new one.');
  });

  it('keeps the guest signed in after a reload', async () => {
    const email = uniqueEmail('persist');
    await signInThroughUi(email);
    await expect(PropertiesPage.title).toBeDisplayed();

    await browser.refresh();

    await expect(PropertiesPage.title).toBeDisplayed();
    await Header.openMenuIfCollapsed();
    await expect(Header.guestEmail).toHaveText(email);
  });

  it('signs out and ends the session on the server', async () => {
    const guest = await api.createGuest('signout');
    await openAs(guest, '/');
    await expect(PropertiesPage.title).toBeDisplayed();

    await Header.signOut();

    await expect(SignInPage.emailInput).toBeDisplayed();
    await browser.refresh();
    await expect(SignInPage.emailInput).toBeDisplayed();
    // API + UI together: after signing out in the UI, the old token must be rejected by the server.
    const me = await apiRequest('GET', '/api/me', { token: guest.token });
    expect(me.status).toBe(401);
  });
});
