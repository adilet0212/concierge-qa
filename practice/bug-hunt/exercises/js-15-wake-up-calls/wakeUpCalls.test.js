import { describe, expect, it } from 'vitest';
import { roomsAt, scheduleWakeUpCalls } from './wakeUpCalls.js';

describe('scheduleWakeUpCalls', () => {
  it('reads out the right room number for every call', () => {
    // A fake phone system: store the callbacks now, run them "in the morning".
    const scheduled = [];
    scheduleWakeUpCalls([1204, 1507, 802], (callback) => scheduled.push(callback));

    const messages = scheduled.map((callback) => callback());

    expect(messages).toEqual([
      'Good morning! This is your wake-up call for room 1204.',
      'Good morning! This is your wake-up call for room 1507.',
      'Good morning! This is your wake-up call for room 802.',
    ]);
  });
});

describe('roomsAt', () => {
  it('lists the rooms for one time, lowest number first', () => {
    const requests = [
      { room: 1507, time: '06:30' },
      { room: 802, time: '07:00' },
      { room: 1204, time: '06:30' },
    ];
    expect(roomsAt(requests, '06:30')).toEqual([1204, 1507]);
  });
});
