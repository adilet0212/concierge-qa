// Registers wake-up calls with the phone system, which runs each callback later.
export function scheduleWakeUpCalls(roomNumbers, schedule) {
  for (var i = 0; i < roomNumbers.length; i++) {
    schedule(() => `Good morning! This is your wake-up call for room ${roomNumbers[i]}.`);
  }
}
