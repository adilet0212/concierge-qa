import { describe, expect, it } from 'vitest';
import { getTonightsRates } from './rateComparison.js';

// Each property's pricing service answers at a different speed.
const pricingService = {
  toronto: { rate: 450, ms: 150 },
  paris: { rate: 380, ms: 20 },
  tokyo: { rate: 52000, ms: 80 },
};

const fetchRate = (propertyId) =>
  new Promise((resolve) => {
    const { rate, ms } = pricingService[propertyId];
    setTimeout(() => resolve(rate), ms);
  });

describe('getTonightsRates', () => {
  it('returns each rate next to the right property', async () => {
    await expect(getTonightsRates(['toronto', 'paris', 'tokyo'], fetchRate)).resolves.toEqual([
      { propertyId: 'toronto', rate: 450 },
      { propertyId: 'paris', rate: 380 },
      { propertyId: 'tokyo', rate: 52000 },
    ]);
  });

  it('fetches in parallel (total time is close to the slowest call, not the sum)', async () => {
    const started = Date.now();
    await getTonightsRates(['toronto', 'paris', 'tokyo'], fetchRate);
    // One after another would take 150 + 20 + 80 = 250 ms.
    expect(Date.now() - started).toBeLessThan(230);
  });

  it('returns an empty list when there is nothing to compare', async () => {
    await expect(getTonightsRates([], fetchRate)).resolves.toEqual([]);
  });
});
