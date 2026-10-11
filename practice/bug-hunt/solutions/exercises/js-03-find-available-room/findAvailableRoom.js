// Used by the front desk to assign a room at check-in.
export function findAvailableRoom(rooms, roomType) {
  for (const room of rooms) {
    if (room.type === roomType && room.available) {
      return room;
    }
  }
  // Fixed: only give up after checking every room (and also for an empty list).
  return null;
}

// The front desk screen shows how many rooms of each type are free, e.g. { king: 1, suite: 1 }.
export function countAvailableByType(rooms) {
  const counts = {};
  for (const room of rooms) {
    if (room.available) {
      counts[room.type] = (counts[room.type] ?? 0) + 1;
    }
  }
  return counts;
}
