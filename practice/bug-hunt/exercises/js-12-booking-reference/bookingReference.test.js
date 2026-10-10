import { describe, expect, it } from 'vitest';
import { isValidReference } from './bookingReference.js';

describe('isValidReference', () => {
  it.each(['AUR-4F7K2Q', '  aur-4f7k2q ', 'AUR-000000'])('accepts %j', (input) => {
    expect(isValidReference(input)).toBe(true);
  });

  it.each(['AUR-4F7K2Q9', 'XAUR-4F7K2Q', 'AUR-4F7K', 'AUR_4F7K2Q', 'AUR-4F7K2Q AUR-1'])('rejects %j', (input) => {
    expect(isValidReference(input)).toBe(false);
  });
});
