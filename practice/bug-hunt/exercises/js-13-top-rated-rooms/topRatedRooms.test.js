import { describe, expect, it } from 'vitest';
import { ratingLabel, topRatedRooms } from './topRatedRooms.js';

function sampleRooms() {
  return [
    { name: 'Deluxe King', rating: 4.6 },
    { name: 'Garden Suite', rating: 4.9 },
    { name: 'Classic Twin', rating: 4.2 },
    { name: 'Penthouse', rating: 4.8 },
  ];
}

describe('topRatedRooms', () => {
  it('returns the best-rated rooms first', () => {
    expect(topRatedRooms(sampleRooms(), 2).map((room) => room.name)).toEqual(['Garden Suite', 'Penthouse']);
  });

  it('returns three rooms by default', () => {
    expect(topRatedRooms(sampleRooms())).toHaveLength(3);
  });

  it('keeps the full room list in the order the hotel chose', () => {
    const rooms = sampleRooms();
    topRatedRooms(rooms, 2);
    expect(rooms.map((room) => room.name)).toEqual(['Deluxe King', 'Garden Suite', 'Classic Twin', 'Penthouse']);
  });
});

describe('ratingLabel', () => {
  it('shows the rating with one decimal and the number of reviews', () => {
    expect(ratingLabel({ rating: 4.9, reviewCount: 212 })).toBe('★ 4.9 (212 reviews)');
  });

  it('uses the singular for one review', () => {
    expect(ratingLabel({ rating: 5, reviewCount: 1 })).toBe('★ 5.0 (1 review)');
  });
});
