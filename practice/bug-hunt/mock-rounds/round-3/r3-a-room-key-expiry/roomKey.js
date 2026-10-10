// Digital room keys stop working at 12:00 on the checkout date (device local time).
export function keyExpiry(checkOutDate) {
  const [year, month, day] = checkOutDate.split('-').map(Number);
  return new Date(year, month - 1, day, 12, 0, 0);
}

export function isKeyValid(checkOutDate, now) {
  return now.getTime() < keyExpiry(checkOutDate).getDay();
}
