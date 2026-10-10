import { openAsNewGuest, placeOrderViaApi, setOrderStatus } from '../../support/aurelle.js';
import OrderPage from './order.page.js';

describe('Order tracking', () => {
  it('shows when the kitchen starts preparing the order', async () => {
    const guest = await openAsNewGuest('/');
    const order = await placeOrderViaApi(guest.token, 'tokyo', [{ menuItemId: 'club-sandwich', quantity: 1 }]);

    await OrderPage.open(order.id);
    await setOrderStatus(order.id, 'preparing');

    await OrderPage.waitForStatus('Preparing');
  });
});
