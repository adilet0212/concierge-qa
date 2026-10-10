import { browser, expect } from '@wdio/globals';
import TabBar from '../screens/TabBar.ts';
import WebViewScreen from '../screens/WebViewScreen.ts';
import { restartApp } from '../support/app.ts';

describe('WebView @regression', () => {
  beforeEach(restartApp);

  it('shows a web page inside the native app', async () => {
    await TabBar.open('Webview');
    await expect(WebViewScreen.webView).toBeDisplayed();

    // Appium sees an app as "contexts": NATIVE_APP plus one WEBVIEW_* context per web view.
    // Switching into the WEBVIEW context would let us test the page with normal web selectors.
    await browser.waitUntil(
      async () => {
        const contexts = await browser.getContexts();
        return contexts.some((context) => String(typeof context === 'string' ? context : context.id).startsWith('WEBVIEW'));
      },
      { timeout: 30_000, timeoutMsg: 'The app never exposed a WEBVIEW context' },
    );
  });
});
