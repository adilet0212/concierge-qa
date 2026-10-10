import { describe, expect, it } from 'vitest';
import { scheduleWakeUpCalls } from './wakeUpCalls.js';

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
