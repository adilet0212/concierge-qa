// Treatment start times for one day, e.g. ['09:00', '10:00', ...].
export function spaSlots({ open, close, durationMinutes, booked = [] }) {
  const opening = toMinutes(open);
  const closing = toMinutes(close);
  // Fixed (bug 2): no "+ 1". Four 60-minute treatments fit between 09:00 and 13:00;
  // a fifth would start at 13:00 and end after closing (a fencepost error).
  const slotCount = Math.floor((closing - opening) / durationMinutes);

  const slots = [];
  for (let i = 0; i < slotCount; i++) {
    const time = toTime(opening + i * durationMinutes);
    if (!booked.includes(time)) slots.push(time);
  }
  return slots;
}

function toMinutes(time) {
  // Fixed (bug 1): split() gives strings. hours * 60 is a number, but number + '00' is string
  // concatenation ('540' + '00' = '54000'). Subtraction happened to work because `-` converts
  // strings to numbers, which hid the problem; `+` does not. Convert both parts first.
  const [hours, minutes] = time.split(':').map(Number);
  return hours * 60 + minutes;
}

function toTime(totalMinutes) {
  const hours = String(Math.floor(totalMinutes / 60)).padStart(2, '0');
  const minutes = String(totalMinutes % 60).padStart(2, '0');
  return `${hours}:${minutes}`;
}
