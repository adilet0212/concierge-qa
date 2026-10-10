// Treatment start times for one day, e.g. ['09:00', '10:00', ...].
export function spaSlots({ open, close, durationMinutes, booked = [] }) {
  const opening = toMinutes(open);
  const closing = toMinutes(close);
  const slotCount = Math.floor((closing - opening) / durationMinutes) + 1;

  const slots = [];
  for (let i = 0; i < slotCount; i++) {
    const time = toTime(opening + i * durationMinutes);
    if (!booked.includes(time)) slots.push(time);
  }
  return slots;
}

function toMinutes(time) {
  const [hours, minutes] = time.split(':');
  return hours * 60 + minutes;
}

function toTime(totalMinutes) {
  const hours = String(Math.floor(totalMinutes / 60)).padStart(2, '0');
  const minutes = String(totalMinutes % 60).padStart(2, '0');
  return `${hours}:${minutes}`;
}
