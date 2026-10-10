import { describe, expect, it } from 'vitest';
import { lateCheckoutFee } from './lateCheckout.js';

describe('lateCheckoutFee', () => {
  it.each([
    ['silver', 11, true, 0],
    ['silver', 13, true, 50],
    ['silver', 16, true, 100],
    ['silver', 16, false, 0],
    ['gold', 13, true, 0],
    ['platinum', 15, true, 0],
  ])('%s member leaving at %i:00 (room needed: %s) pays $%i', (tier, hour, roomNeeded, fee) => {
    expect(lateCheckoutFee({ tier }, hour, roomNeeded)).toBe(fee);
  });
});
