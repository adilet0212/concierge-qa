import { describe, expect, it } from 'vitest';
import { isValidPromo, validPromos } from './promoCodes.js';

describe('isValidPromo', () => {
  it('accepts a valid code every time it is checked', () => {
    expect(isValidPromo('SUMR26')).toBe(true);
    expect(isValidPromo('SUMR26')).toBe(true);
  });

  it('accepts lowercase codes with spaces around them', () => {
    expect(isValidPromo(' golf15 ')).toBe(true);
  });

  it('rejects codes in the wrong format', () => {
    expect(isValidPromo('SPRING')).toBe(false);
  });
});

describe('validPromos', () => {
  it('keeps every valid code from the list', () => {
    expect(validPromos(['SUMR26', 'GOLF15', 'bad', 'SPAS10'])).toEqual(['SUMR26', 'GOLF15', 'SPAS10']);
  });
});
