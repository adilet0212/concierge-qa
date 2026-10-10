import { BasePage } from './BasePage.ts';
import type { PricePart } from './BookingPage.ts';

class ConfirmationPage extends BasePage {
  get title() {
    return this.byTestId('confirmation-title');
  }

  get reference() {
    return this.byTestId('booking-reference');
  }

  /** The check-in moment. data-local-date / data-local-time say which date and time it shows. */
  get checkIn() {
    return this.byTestId('confirmation-checkin');
  }

  get checkOut() {
    return this.byTestId('confirmation-checkout');
  }

  get nights() {
    return this.byTestId('confirmation-nights');
  }

  price(part: PricePart) {
    return this.byTestId(`price-${part}`);
  }
}

export default new ConfirmationPage();
