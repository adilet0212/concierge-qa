import { describe, expect, it } from 'vitest';
import { calculateBill } from './diningBill.js';

describe('calculateBill', () => {
  it('prices a sandwich and a juice', () => {
    const items = [
      { name: 'Club sandwich', price: 24.4, quantity: 1 },
      { name: 'Fresh juice', price: 6.2, quantity: 1 },
    ];
    expect(calculateBill(items, 0.13)).toEqual({ subtotal: 30.6, tax: 3.98, total: 34.58 });
  });

  it('prices a coffee break', () => {
    const items = [
      { name: 'Espresso', price: 1.1, quantity: 1 },
      { name: 'Biscotti', price: 2.2, quantity: 1 },
    ];
    expect(calculateBill(items, 0.05)).toEqual({ subtotal: 3.3, tax: 0.17, total: 3.47 });
  });

  it('prices round amounts', () => {
    const items = [{ name: 'Steak frites', price: 42, quantity: 2 }];
    expect(calculateBill(items, 0.1)).toEqual({ subtotal: 84, tax: 8.4, total: 92.4 });
  });
});
