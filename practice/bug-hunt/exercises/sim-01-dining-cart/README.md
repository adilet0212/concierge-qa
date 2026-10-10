# sim-01 · Dining cart (interview simulation)

**Difficulty:** ●●● (3/3) · this module has **more than one** bug.

## What it should do
`DiningCart` holds a guest's in-room dining order before it is placed. Prices are in cents.

- `new DiningCart(menu, { taxRate, serviceChargeRate })`. `menu` is `[{ id, name, priceCents }]`.
- `add(itemId, quantity = 1)`: adds the dish. Adding a dish that is already in the cart increases
  its quantity. Unknown dishes throw `Unknown menu item: <id>`.
- `remove(itemId)`: removes that dish. Removing a dish that is not in the cart does nothing.
- `itemCount()`: total number of portions in the cart.
- `totals()`: `{ subtotal, tax, serviceCharge, total }` where
  - `tax` = subtotal × taxRate, rounded to the cent
  - `serviceCharge` = subtotal × serviceChargeRate, rounded to the cent (service is calculated on the food only)
  - `total` = subtotal + tax + serviceCharge

## Example
Menu: club sandwich 2400, sparkling water 200, steak frites 4200. Rates: tax 13%, service 18%.

```js
cart.add('club-sandwich');
cart.add('club-sandwich');
cart.add('sparkling-water');
cart.itemCount(); // 3
cart.totals();    // { subtotal: 5000, tax: 650, serviceCharge: 900, total: 6550 }
cart.remove('steak-frites'); // not in the cart: nothing changes
cart.itemCount(); // 3
```

## Your task
This is the closest thing to a real interview round. Set a 15-minute timer, read `diningCart.js`
top to bottom, and talk through every bug you find. Then confirm:

```bash
npm run bug-hunt -- sim-01
```
