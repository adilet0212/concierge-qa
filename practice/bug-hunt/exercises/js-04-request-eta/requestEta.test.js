import { describe, expect, it } from 'vitest';
import { requestEtaMinutes } from './requestEta.js';

describe('requestEtaMinutes', () => {
  it.each([
    ['towels', 10],
    ['pillows', 15],
    ['in-room-dining', 35],
    ['late-checkout', 0],
    ['umbrella', 20],
  ])('%s -> %i minutes', (requestType, minutes) => {
    expect(requestEtaMinutes(requestType)).toBe(minutes);
  });
});
