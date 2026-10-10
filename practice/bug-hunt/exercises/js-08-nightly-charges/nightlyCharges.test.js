import { describe, expect, it } from 'vitest';
import { buildNightlyCharges, folioTotal } from './nightlyCharges.js';

describe('buildNightlyCharges', () => {
  it('creates one dated charge per night', () => {
    expect(buildNightlyCharges('2026-03-10', 3, 25000)).toEqual([
      { date: '2026-03-10', amount: 25000 },
      { date: '2026-03-11', amount: 25000 },
      { date: '2026-03-12', amount: 25000 },
    ]);
  });

  it('crosses a month boundary', () => {
    const dates = buildNightlyCharges('2026-01-30', 3, 100).map((charge) => charge.date);
    expect(dates).toEqual(['2026-01-30', '2026-01-31', '2026-02-01']);
  });
});

describe('folioTotal', () => {
  it('adds up the room charges', () => {
    expect(folioTotal(buildNightlyCharges('2026-03-10', 2, 25000))).toBe(50000);
  });
});
