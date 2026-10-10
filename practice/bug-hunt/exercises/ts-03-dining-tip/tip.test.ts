import { describe, expect, it } from 'vitest';
import { tipAmount } from './tip.ts';

describe('tipAmount', () => {
  it('suggests 15% when the guest skipped the tip step', () => {
    expect(tipAmount({ subtotal: 4000 })).toBe(600);
  });

  it('uses the percentage the guest chose', () => {
    expect(tipAmount({ subtotal: 4000, tipPercent: 20 })).toBe(800);
    expect(tipAmount({ subtotal: 1999, tipPercent: 18 })).toBe(360);
  });

  it('respects a guest who chose not to tip', () => {
    expect(tipAmount({ subtotal: 4000, tipPercent: 0 })).toBe(0);
  });
});
