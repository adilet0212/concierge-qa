import { describe, expect, it } from 'vitest';
import { arrivalLabel } from './arrivalLabel.js';

describe('arrivalLabel', () => {
  it.each([
    ['2026-03-15', 'Sun, 15 Mar 2026'],
    ['2026-12-31', 'Thu, 31 Dec 2026'],
    ['2026-01-31', 'Sat, 31 Jan 2026'],
  ])('%s -> %s', (isoDate, label) => {
    expect(arrivalLabel(isoDate)).toBe(label);
  });
});
