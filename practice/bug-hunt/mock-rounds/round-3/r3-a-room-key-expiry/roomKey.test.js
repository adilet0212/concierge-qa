import { describe, expect, it } from 'vitest';
import { isKeyValid } from './roomKey.js';

describe('isKeyValid', () => {
  it.each([
    [new Date(2026, 6, 3, 22, 0), true],
    [new Date(2026, 6, 4, 11, 59), true],
    [new Date(2026, 6, 4, 12, 0), false],
    [new Date(2026, 6, 5, 9, 0), false],
  ])('checkout 2026-07-04, now %s -> valid: %s', (now, expected) => {
    expect(isKeyValid('2026-07-04', now)).toBe(expected);
  });
});
