import { describe, expect, it } from 'vitest';
import { filterOptions, filterRooms, STATUS } from './roomFilter.js';

const rooms = [
  { number: 801, status: STATUS.VACANT },
  { number: 802, status: STATUS.OCCUPIED },
  { number: 803, status: STATUS.CLEANING },
  { number: 804, status: STATUS.VACANT },
];

const numbers = (list) => list.map((room) => room.number);

describe('filterRooms', () => {
  it('shows every room for "All rooms"', () => {
    expect(numbers(filterRooms(rooms, ''))).toEqual([801, 802, 803, 804]);
  });

  it('shows only vacant rooms', () => {
    expect(numbers(filterRooms(rooms, STATUS.VACANT))).toEqual([801, 804]);
  });

  it('shows only occupied rooms', () => {
    expect(numbers(filterRooms(rooms, STATUS.OCCUPIED))).toEqual([802]);
  });
});

describe('filterOptions', () => {
  it('starts with "All rooms", then one option per status', () => {
    expect(filterOptions()).toEqual([
      { value: '', label: 'All rooms' },
      { value: STATUS.VACANT, label: 'Vacant' },
      { value: STATUS.OCCUPIED, label: 'Occupied' },
      { value: STATUS.CLEANING, label: 'Being cleaned' },
    ]);
  });
});
