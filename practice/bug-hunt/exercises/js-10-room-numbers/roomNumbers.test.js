import { describe, expect, it } from 'vitest';
import { parseRoomNumbers } from './roomNumbers.js';

describe('parseRoomNumbers', () => {
  it('parses a list with inconsistent spacing', () => {
    expect(parseRoomNumbers('1204, 1207,1301')).toEqual([1204, 1207, 1301]);
  });

  it('parses a single room', () => {
    expect(parseRoomNumbers('802')).toEqual([802]);
  });

  it('parses a longer list', () => {
    expect(parseRoomNumbers('1502,1503,1504,1505')).toEqual([1502, 1503, 1504, 1505]);
  });
});
