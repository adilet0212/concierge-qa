import { beforeEach, describe, expect, it } from 'vitest';
import { DiningCart } from './diningCart.js';

const menu = [
  { id: 'club-sandwich', name: 'Club sandwich', priceCents: 2400 },
  { id: 'sparkling-water', name: 'Sparkling water', priceCents: 200 },
  { id: 'steak-frites', name: 'Steak frites', priceCents: 4200 },
];

describe('DiningCart', () => {
  let cart;

  beforeEach(() => {
    cart = new DiningCart(menu, { taxRate: 0.13, serviceChargeRate: 0.18 });
  });

  it('increases the quantity when the same dish is added again', () => {
    cart.add('club-sandwich');
    cart.add('club-sandwich', 2);
    expect(cart.itemCount()).toBe(3);
  });

  it('rejects dishes that are not on the menu', () => {
    expect(() => cart.add('lobster')).toThrow('Unknown menu item: lobster');
  });

  it('removes a dish', () => {
    cart.add('club-sandwich');
    cart.add('sparkling-water');
    cart.remove('club-sandwich');
    expect(cart.itemCount()).toBe(1);
  });

  it('does nothing when removing a dish that is not in the cart', () => {
    cart.add('club-sandwich');
    cart.add('sparkling-water');
    cart.remove('steak-frites');
    expect(cart.itemCount()).toBe(2);
  });

  it('charges tax and service on the food subtotal only', () => {
    cart.add('club-sandwich');
    cart.add('club-sandwich');
    cart.add('sparkling-water');
    expect(cart.totals()).toEqual({ subtotal: 5000, tax: 650, serviceCharge: 900, total: 6550 });
  });
});
