import { describe, expect, it } from 'vitest';
import { cheapestRate } from './cheapestRate.js';

const offers = (...rates) => rates.map((nightlyRate) => ({ nightlyRate }));

describe('cheapestRate', () => {
  it('returns the lowest rate', () => {
    expect(cheapestRate(offers(450, 95, 1200, 300))).toBe(95);
  });

  it('works when the rates have different numbers of digits', () => {
    expect(cheapestRate(offers(1450, 780))).toBe(780);
  });

  it('works for a single offer', () => {
    expect(cheapestRate(offers(620))).toBe(620);
  });
});
