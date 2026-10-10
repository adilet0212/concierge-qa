import { $, browser } from '@wdio/globals';

class OrderPage {
  get status() {
    $('[data-testid="order-status"]');
  }

  async open(orderId) {
    await browser.url(`/orders/${orderId}`);
  }

  async waitForStatus(expected) {
    await browser.waitUntil(
      async () => {
        (await this.status.getText()) === expected;
      },
      { timeout: 8000, timeoutMsg: `Order never reached status "${expected}"` },
    );
  }
}

export default new OrderPage();
