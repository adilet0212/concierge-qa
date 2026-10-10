// Used by the front desk to assign a room at check-in.
export function findAvailableRoom(rooms, roomType) {
  for (const room of rooms) {
    if (room.type === roomType && room.available) {
      return room;
    }
    return null;
  }
}
