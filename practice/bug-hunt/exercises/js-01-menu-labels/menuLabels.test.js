import { describe, expect, it } from 'vitest';
import { menuLabels } from './menuLabels.js';

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
