// Rooms housekeeping should clean first, pasted from an email.
// Empty entries (e.g. from a trailing comma) are skipped.
export function parseRoomNumbers(input) {
  return input
    .split(',')
    .filter((part) => part.trim() !== '')
    .map(parseInt);
}

// The route shown on the housekeeping tablet, e.g. "1204 → 1207 → 1301".
export function cleaningRoute(roomNumbers) {
  return roomNumbers.join(' → ');
}
