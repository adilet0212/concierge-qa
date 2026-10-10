export const STATUS = { VACANT: 0, OCCUPIED: 1, CLEANING: 2 };

// statusFilter is a STATUS code, or '' for "All rooms".
export function filterRooms(rooms, statusFilter) {
  // Fixed: `0 == ''` is true (type coercion), so "vacant" behaved like "All rooms".
  // Strict equality compares type and value.
  return rooms.filter((room) => statusFilter === '' || room.status === statusFilter);
}
