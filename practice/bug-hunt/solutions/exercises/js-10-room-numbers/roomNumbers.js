// Rooms housekeeping should clean first, pasted from an email.
// Empty entries (e.g. from a trailing comma) are skipped.
export function parseRoomNumbers(input) {
  // Fixed: map passes (value, index), and parseInt treats the index as the radix.
  // Pass a callback that calls parseInt with an explicit radix of 10.
  return input
    .split(',')
    .filter((part) => part.trim() !== '')
    .map((part) => Number.parseInt(part, 10));
}

// The route shown on the housekeeping tablet, e.g. "1204 → 1207 → 1301".
export function cleaningRoute(roomNumbers) {
  return roomNumbers.join(' → ');
}
