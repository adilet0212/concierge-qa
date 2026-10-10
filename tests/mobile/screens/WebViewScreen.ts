import { $ } from '@wdio/globals';
import { BaseScreen } from './BaseScreen.ts';

/** A native screen that embeds a web page (an Android WebView showing webdriver.io). */
class WebViewScreen extends BaseScreen {
  /** WebViews have no accessibility id, so we find the native WebView by its Android class. */
  get webView() {
    return $('android=new UiSelector().className("android.webkit.WebView")');
  }
}

export default new WebViewScreen();
