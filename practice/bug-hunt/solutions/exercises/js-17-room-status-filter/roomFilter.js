export const STATUS = { VACANT: 0, OCCUPIED: 1, CLEANING: 2 };
export const STATUS_LABELS = ['Vacant', 'Occupied', 'Being cleaned']; // index = STATUS code

// statusFilter is a STATUS code, or '' for "All rooms".
export function filterRooms(rooms, statusFilter) {
  // Fixed: `0 == ''` is true (type coercion), so "vacant" behaved like "All rooms".
  // Strict equality compares type and value.
  return rooms.filter((room) => statusFilter === '' || room.status === statusFilter);
}

// Options for the status drop-down: "All rooms" first, then one per status code.
export function filterOptions() {
  const statusOptions = STATUS_LABELS.map((label, code) => ({ value: code, label }));
  return [{ value: '', label: 'All rooms' }, ...statusOptions];
}
