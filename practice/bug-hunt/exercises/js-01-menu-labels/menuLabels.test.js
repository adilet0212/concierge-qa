import { describe, expect, it } from 'vitest';
import { cartSummary, menuLabels } from './menuLabels.js';

describe('menuLabels', () => {
  it('builds one label per dish with the price in dollars', () => {
    const dishes = [
      { name: 'Club sandwich', priceCents: 2400 },
      { name: 'Fresh orange juice', priceCents: 650 },
    ];
    expect(menuLabels(dishes)).toEqual(['Club sandwich · $24.00', 'Fresh orange juice · $6.50']);
  });

  it('returns an empty list for an empty menu', () => {
    expect(menuLabels([])).toEqual([]);
  });
});

describe('cartSummary', () => {
  it('counts the items and adds up the total', () => {
    expect(cartSummary([{ priceCents: 2400, quantity: 2 }, { priceCents: 650, quantity: 1 }])).toBe('3 items · $54.50');
  });

  it('uses the singular for one item', () => {
    expect(cartSummary([{ priceCents: 650, quantity: 1 }])).toBe('1 item · $6.50');
  });
});
