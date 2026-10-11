// "Guest favourites" carousel on the property page.
export function topRatedRooms(rooms, count = 3) {
  return rooms.sort((a, b) => b.rating - a.rating).slice(0, count);
}

// The rating line on each card, e.g. "★ 4.9 (212 reviews)".
export function ratingLabel(room) {
  const reviews = room.reviewCount === 1 ? '1 review' : `${room.reviewCount} reviews`;
  return `★ ${room.rating.toFixed(1)} (${reviews})`;
}
