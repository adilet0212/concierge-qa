import { describe, expect, it } from 'vitest';
import { isRoomFree, type Reservation } from './availability.ts';

const reservations: Reservation[] = [{ roomNumber: 1204, checkIn: '2026-05-10', checkOut: '2026-05-13' }];

describe('isRoomFree', () => {
  it.each([
    ['2026-05-01', '2026-05-04', true],
    ['2026-05-11', '2026-05-12', false],
    ['2026-05-13', '2026-05-15', true],
    ['2026-05-08', '2026-05-10', true],
    ['2026-05-12', '2026-05-16', false],
  ])('room 1204 from %s to %s -> free: %s', (checkIn, checkOut, expected) => {
    expect(isRoomFree(1204, { checkIn, checkOut }, reservations)).toBe(expected);
  });

  it('ignores reservations for other rooms', () => {
    expect(isRoomFree(1205, { checkIn: '2026-05-11', checkOut: '2026-05-12' }, reservations)).toBe(true);
  });
});
