import { describe, expect, it } from 'vitest';
import { hotelLocalDate, isBreakfastVoucherValid, voucherMessage } from './hotelLocalDate.js';

describe('hotelLocalDate', () => {
  it.each([
    ['2026-03-14T20:00:00Z', 'Asia/Tokyo', '2026-03-15'],
    ['2026-03-15T12:00:00Z', 'Asia/Tokyo', '2026-03-15'],
    ['2026-07-01T03:00:00Z', 'Pacific/Honolulu', '2026-06-30'],
    ['2026-07-01T03:00:00Z', 'Europe/Paris', '2026-07-01'],
  ])('%s in %s is %s', (instant, timeZone, expected) => {
    expect(hotelLocalDate(new Date(instant), timeZone)).toBe(expected);
  });
});

describe('isBreakfastVoucherValid', () => {
  it('accepts a Tokyo voucher during a Tokyo evening', () => {
    const voucher = { validOn: '2026-03-15' };
    expect(isBreakfastVoucherValid(voucher, new Date('2026-03-15T12:00:00Z'), 'Asia/Tokyo')).toBe(true);
  });
});

describe('voucherMessage', () => {
  it('tells the guest which day a voucher for another day is valid', () => {
    const voucher = { validOn: '2026-03-20' };
    const now = new Date('2026-03-15T12:00:00Z');
    expect(voucherMessage(voucher, now, 'Asia/Tokyo')).toBe('This voucher is valid on 2026-03-20.');
  });
});
