export const STATUS = { VACANT: 0, OCCUPIED: 1, CLEANING: 2 };

// statusFilter is a STATUS code, or '' for "All rooms".
export function filterRooms(rooms, statusFilter) {
  return rooms.filter((room) => statusFilter == '' || room.status == statusFilter);
}
