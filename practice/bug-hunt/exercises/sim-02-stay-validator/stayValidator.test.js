import { describe, expect, it } from 'vitest';
import { nightsBetween, validateStay } from './stayValidator.js';

const deluxeKing = { name: 'Deluxe King', maxGuests: 2 };

function form(overrides) {
  return {
    checkIn: '2026-06-10',
    checkOut: '2026-06-13',
    adults: 2,
    children: 0,
    room: deluxeKing,
    today: '2026-06-01',
    ...overrides,
  };
}

describe('nightsBetween', () => {
  it('counts nights in a normal week', () => {
    expect(nightsBetween('2026-06-10', '2026-06-13')).toBe(3);
  });

  it('counts nights across the spring daylight-saving change', () => {
    expect(nightsBetween('2026-03-07', '2026-03-09')).toBe(2);
  });
});

describe('validateStay', () => {
  it('accepts a normal stay that fills the room exactly', () => {
    expect(validateStay(form({}))).toEqual({ valid: true, nights: 3, errors: [] });
  });

  it('accepts a stay over the daylight-saving weekend', () => {
    const result = validateStay(form({ checkIn: '2026-03-07', checkOut: '2026-03-09', adults: 1, today: '2026-03-01' }));
    expect(result).toEqual({ valid: true, nights: 2, errors: [] });
  });

  it('rejects check-out on the same day as check-in', () => {
    const result = validateStay(form({ checkOut: '2026-06-10' }));
    expect(result.valid).toBe(false);
    expect(result.errors).toContain('Check-out must be after check-in.');
  });

  it('rejects a check-in in the past', () => {
    expect(validateStay(form({ today: '2026-06-11' })).errors).toContain('Check-in cannot be in the past.');
  });

  it('rejects more guests than the room fits', () => {
    const result = validateStay(form({ adults: 2, children: 1 }));
    expect(result.errors).toEqual(['This room fits up to 2 guests.']);
  });
});
