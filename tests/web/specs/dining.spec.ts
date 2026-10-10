import { expect } from '@wdio/globals';
import DiningPage from '../pageobjects/DiningPage.ts';
import OrderPage from '../pageobjects/OrderPage.ts';
import { api } from '../support/api-client.ts';
import { expectedDiningBill } from '../support/expected.ts';
import { openAs } from '../support/session.ts';
import { properties } from '../support/test-data.ts';

describe('In-room dining @regression', () => {
  it('places an order and tracks its status @smoke', async () => {
    const guest = await api.createGuest('dining');
    await openAs(guest, '/properties/toronto/dining');

    await DiningPage.addDish('club-sandwich', 2);
    await DiningPage.addDish('sparkling-water');
    await expect(DiningPage.quantity('club-sandwich')).toHaveText('2');
    await DiningPage.placeOrderButton.click();

    await expect(OrderPage.status).toHaveText('Received');

    // The kitchen starts cooking: staff do that from their own tablet (here, through the API)...
    const [order] = await api.listOrders(guest);
    await api.setOrderStatus(order.id, 'preparing');

    // ...and the guest's page shows it without a reload, because it polls the server.
    // toHaveText keeps retrying until the text matches (up to waitforTimeout).
    await expect(OrderPage.status).toHaveText('Preparing');
    await expect(OrderPage.step('received')).toHaveAttribute('data-state', 'done');
  });

  // Data-driven: every property has its own tax and service charge rates.
  for (const hotel of properties) {
    it(`calculates the in-room dining bill at ${hotel.name}`, async () => {
      const expected = expectedDiningBill(hotel);
      const guest = await api.createGuest('bill');
      await openAs(guest, `/properties/${hotel.id}/dining`);

      for (const dish of hotel.testOrder) {
        await DiningPage.addDish(dish.dishId, dish.quantity);
      }

      await expect(DiningPage.subtotal).toHaveAttribute('data-amount', String(expected.subtotal));
      await expect(DiningPage.tax).toHaveAttribute('data-amount', String(expected.tax));
      await expect(DiningPage.serviceCharge).toHaveAttribute('data-amount', String(expected.serviceCharge));
      await expect(DiningPage.total).toHaveAttribute('data-amount', String(expected.total));
    });
  }

  it('creates only one order when Place order is double-clicked', async () => {
    const guest = await api.createGuest('doubleclick');
    await openAs(guest, '/properties/tokyo/dining');
    await DiningPage.addDish('club-sandwich');

    // Guests double-tap buttons all the time, especially on a slow hotel network.
    await DiningPage.placeOrderButton.doubleClick();
    await expect(OrderPage.status).toHaveText('Received');

    const orders = await api.listOrders(guest);
    expect(orders).toHaveLength(1);
  });

  it('updates quantities and empties the cart', async () => {
    const guest = await api.createGuest('cart');
    await openAs(guest, '/properties/paris/dining');
    await expect(DiningPage.emptyCartMessage).toBeDisplayed();
    await expect(DiningPage.placeOrderButton).toBeDisabled();

    await DiningPage.addDish('caesar-salad');
    await DiningPage.increaseButton('caesar-salad').click();
    await expect(DiningPage.quantity('caesar-salad')).toHaveText('2');

    await DiningPage.decreaseButton('caesar-salad').click();
    await DiningPage.decreaseButton('caesar-salad').click();

    await expect(DiningPage.emptyCartMessage).toBeDisplayed();
    await expect(DiningPage.total).toHaveAttribute('data-amount', '0');
    await expect(DiningPage.placeOrderButton).toBeDisabled();
  });
});
