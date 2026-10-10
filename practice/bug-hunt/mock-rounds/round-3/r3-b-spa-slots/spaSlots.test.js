import { describe, expect, it } from 'vitest';
import { spaSlots } from './spaSlots.js';

describe('spaSlots', () => {
  it('lists hourly slots that end by closing time', () => {
    expect(spaSlots({ open: '09:00', close: '13:00', durationMinutes: 60 })).toEqual([
      '09:00',
      '10:00',
      '11:00',
      '12:00',
    ]);
  });

  it('handles 90-minute treatments', () => {
    expect(spaSlots({ open: '09:00', close: '13:00', durationMinutes: 90 })).toEqual(['09:00', '10:30']);
  });

  it('leaves out booked start times', () => {
    expect(spaSlots({ open: '09:00', close: '13:00', durationMinutes: 90, booked: ['10:30'] })).toEqual(['09:00']);
  });

  it('works for an afternoon opening with odd durations', () => {
    expect(spaSlots({ open: '14:30', close: '17:00', durationMinutes: 50 })).toEqual(['14:30', '15:20', '16:10']);
  });
});
