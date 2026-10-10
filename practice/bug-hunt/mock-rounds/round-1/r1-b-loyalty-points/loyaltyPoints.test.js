import { describe, expect, it } from 'vitest';
import { pointsForStay } from './loyaltyPoints.js';

describe('pointsForStay', () => {
  it.each([
    ['480.00', 1, 4800],
    ['1,250.75', 3, 13000],
    ['2,000.00', 5, 20500],
  ])('%s over %i night(s) earns %i points', (roomCharges, nights, points) => {
    expect(pointsForStay({ roomCharges, nights })).toBe(points);
  });
});
