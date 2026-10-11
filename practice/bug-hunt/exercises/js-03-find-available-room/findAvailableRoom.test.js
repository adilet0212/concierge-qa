import { describe, expect, it } from 'vitest';
import { countAvailableByType, findAvailableRoom } from './findAvailableRoom.js';

const rooms = [
  { number: 1201, type: 'suite', available: false },
  { number: 1202, type: 'king', available: true },
  { number: 1203, type: 'suite', available: true },
];

describe('findAvailableRoom', () => {
  it('finds the first available room of the requested type', () => {
    expect(findAvailableRoom(rooms, 'suite')).toEqual({ number: 1203, type: 'suite', available: true });
  });

  it('returns null when nothing matches', () => {
    expect(findAvailableRoom(rooms, 'twin')).toBeNull();
  });

  it('returns null for an empty list', () => {
    expect(findAvailableRoom([], 'king')).toBeNull();
  });
});

describe('countAvailableByType', () => {
  it('counts the available rooms of each type', () => {
    expect(countAvailableByType(rooms)).toEqual({ king: 1, suite: 1 });
  });

  it('returns an empty object for an empty list', () => {
    expect(countAvailableByType([])).toEqual({});
  });
});
