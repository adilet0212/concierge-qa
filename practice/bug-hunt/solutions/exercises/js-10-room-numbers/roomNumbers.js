// Rooms housekeeping should clean first, pasted from an email.
export function parseRoomNumbers(input) {
  // Fixed: map passes (value, index), and parseInt treats the index as the radix.
  // Pass a callback that calls parseInt with an explicit radix of 10.
  return input.split(',').map((part) => Number.parseInt(part, 10));
}
