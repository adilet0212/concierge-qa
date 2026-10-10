// Rooms housekeeping should clean first, pasted from an email.
export function parseRoomNumbers(input) {
  return input.split(',').map(parseInt);
}
