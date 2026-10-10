import { describe, expect, it } from 'vitest';
import { parseStaySearch } from './staySearch.js';

describe('parseStaySearch', () => {
  it('reads every value from the link', () => {
    expect(parseStaySearch('?adults=2&children=1&nights=3')).toEqual({
      adults: 2,
      children: 1,
      nights: 3,
      totalGuests: 3,
    });
  });

  it('uses defaults for missing values', () => {
    expect(parseStaySearch('?adults=2')).toEqual({ adults: 2, children: 0, nights: 1, totalGuests: 2 });
  });

  it('works with an empty query string', () => {
    expect(parseStaySearch('')).toEqual({ adults: 1, children: 0, nights: 1, totalGuests: 1 });
  });
});
