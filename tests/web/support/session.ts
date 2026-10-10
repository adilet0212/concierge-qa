import { browser } from '@wdio/globals';
import Header from '../pageobjects/Header.ts';
import type { Guest } from './api-client.ts';

// Every test starts from a known browser state by calling one of these helpers first.
// The browser stays open for a whole spec file, so we always set (or clear) the session
// and language in localStorage explicitly instead of trusting what the last test left behind.

async function setBrowserState(token: string | null, locale: string) {
  // localStorage belongs to the app's origin, so open any app page first...
  await browser.url('/sign-in');
  // ...and wait until the app has really started (its header is rendered). Writing to
  // localStorage too early can hit the blank page the browser shows while loading.
  await Header.languageSelect.waitForExist();
  await browser.execute(
    (sessionToken, language) => {
      window.localStorage.clear();
      if (sessionToken) window.localStorage.setItem('aurelle.session', sessionToken);
      window.localStorage.setItem('aurelle.locale', language);
    },
    token,
    locale,
  );
}

/** Opens a page as an already signed-in guest (signed in through the API: fast and reliable). */
export async function openAs(guest: Guest, path: string, locale = 'en') {
  await setBrowserState(guest.token, locale);
  await browser.url(path);
}

/** Opens a page as a visitor who is not signed in. */
export async function openSignedOut(path: string, locale = 'en') {
  await setBrowserState(null, locale);
  await browser.url(path);
}
