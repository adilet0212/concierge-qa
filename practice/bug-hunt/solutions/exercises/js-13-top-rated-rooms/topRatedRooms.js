// "Guest favourites" carousel on the property page.
export function topRatedRooms(rooms, count = 3) {
  // Fixed: sort() sorts in place. Copy first so the caller's list keeps its order.
  return [...rooms].sort((a, b) => b.rating - a.rating).slice(0, count);
}
