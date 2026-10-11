// Registers wake-up calls with the phone system, which runs each callback later.
export function scheduleWakeUpCalls(roomNumbers, schedule) {
  // Fixed: `let` creates a new `i` for every iteration; `var` shared one `i`
  // that had already reached roomNumbers.length when the callbacks ran.
  for (let i = 0; i < roomNumbers.length; i++) {
    schedule(() => `Good morning! This is your wake-up call for room ${roomNumbers[i]}.`);
  }
}

// Requests from the front desk, e.g. [{ room: 1204, time: '06:30' }].
// Returns the rooms to call at one time, lowest room number first.
export function roomsAt(requests, time) {
  return requests
    .filter((request) => request.time === time)
    .map((request) => request.room)
    .sort((a, b) => a - b);
}
