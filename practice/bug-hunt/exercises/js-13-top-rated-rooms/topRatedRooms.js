// "Guest favourites" carousel on the property page.
export function topRatedRooms(rooms, count = 3) {
  return rooms.sort((a, b) => b.rating - a.rating).slice(0, count);
}
