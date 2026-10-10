import { BasePage } from './BasePage.ts';

/** Order tracking page. It polls the server, so status changes appear without a reload. */
class OrderPage extends BasePage {
  get title() {
    return this.byTestId('order-title');
  }

  get status() {
    return this.byTestId('order-status');
  }

  step(status: string) {
    return this.byTestId(`order-step-${status}`);
  }
}

export default new OrderPage();
