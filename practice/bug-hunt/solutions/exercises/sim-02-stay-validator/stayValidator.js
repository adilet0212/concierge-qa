const MS_PER_DAY = 24 * 60 * 60 * 1000;

// Number of nights between two ISO dates (YYYY-MM-DD).
export function nightsBetween(checkIn, checkOut) {
  // Fixed (bug 1): local midnights are 23 hours apart on the day clocks spring forward,
  // so floor(47h / 24h) gave 1 night instead of 2. UTC has no daylight saving.
  const start = Date.parse(`${checkIn}T00:00:00Z`);
  const end = Date.parse(`${checkOut}T00:00:00Z`);
  return Math.round((end - start) / MS_PER_DAY);
}

// Runs before the guest can continue to payment.
export function validateStay({ checkIn, checkOut, adults, children, room, today }) {
  const errors = [];
  const nights = nightsBetween(checkIn, checkOut);

  if (checkIn < today) {
    errors.push('Check-in cannot be in the past.');
  }
  // Fixed (bug 2): a stay needs at least one night; 0 nights (same day) must be rejected.
  if (nights < 1) {
    errors.push('Check-out must be after check-in.');
  }
  if (nights > 30) {
    errors.push('Stays longer than 30 nights must be booked by phone.');
  }
  if (adults < 1) {
    errors.push('At least one adult is required.');
  }
  // Fixed (bug 3): a room for 2 accepts 2 guests, so only MORE than maxGuests is an error.
  if (adults + children > room.maxGuests) {
    errors.push(`This room fits up to ${room.maxGuests} guests.`);
  }

  return { valid: errors.length === 0, nights, errors };
}
