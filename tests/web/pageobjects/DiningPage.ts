import { BasePage } from './BasePage.ts';

class DiningPage extends BasePage {
  get title() {
    return this.byTestId('dining-title');
  }

  addButton(dishId: string) {
    return this.byTestId(`add-${dishId}`);
  }

  menuPrice(dishId: string) {
    return this.byTestId(`menu-price-${dishId}`);
  }

  quantity(dishId: string) {
    return this.byTestId(`cart-qty-${dishId}`);
  }

  increaseButton(dishId: string) {
    return this.byTestId(`cart-increase-${dishId}`);
  }

  decreaseButton(dishId: string) {
    return this.byTestId(`cart-decrease-${dishId}`);
  }

  get emptyCartMessage() {
    return this.byTestId('cart-empty');
  }

  // Cart totals: each has a data-amount attribute with the exact amount in minor units.
  get subtotal() {
    return this.byTestId('cart-subtotal');
  }

  get tax() {
    return this.byTestId('cart-tax');
  }

  get serviceCharge() {
    return this.byTestId('cart-service');
  }

  get total() {
    return this.byTestId('cart-total');
  }

  get placeOrderButton() {
    return this.byTestId('place-order');
  }

  async addDish(dishId: string, quantity = 1) {
    for (let i = 0; i < quantity; i++) await this.addButton(dishId).click();
  }
}

export default new DiningPage();
