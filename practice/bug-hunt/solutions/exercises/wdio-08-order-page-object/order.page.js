import { $, browser } from '@wdio/globals';

class OrderPage {
  get status() {
    // Fixed (bug 1): a getter with a { block } body must `return`; it returned undefined.
    return $('[data-testid="order-status"]');
  }

  async open(orderId) {
    await browser.url(`/orders/${orderId}`);
  }

  async waitForStatus(expected) {
    await browser.waitUntil(
      // Fixed (bug 2): the condition must RETURN true/false. It returned undefined (falsy)
      // every time, so waitUntil always waited for the full timeout and then failed.
      async () => (await this.status.getText()) === expected,
      { timeout: 8000, timeoutMsg: `Order never reached status "${expected}"` },
    );
  }
}

export default new OrderPage();
