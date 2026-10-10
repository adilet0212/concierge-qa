const MS_PER_DAY = 24 * 60 * 60 * 1000;

// Number of nights between two ISO dates (YYYY-MM-DD).
export function nightsBetween(checkIn, checkOut) {
  const start = new Date(`${checkIn}T00:00:00`);
  const end = new Date(`${checkOut}T00:00:00`);
  return Math.floor((end - start) / MS_PER_DAY);
}

// Runs before the guest can continue to payment.
export function validateStay({ checkIn, checkOut, adults, children, room, today }) {
  const errors = [];
  const nights = nightsBetween(checkIn, checkOut);

  if (checkIn < today) {
    errors.push('Check-in cannot be in the past.');
  }
  if (nights < 0) {
    errors.push('Check-out must be after check-in.');
  }
  if (nights > 30) {
    errors.push('Stays longer than 30 nights must be booked by phone.');
  }
  if (adults < 1) {
    errors.push('At least one adult is required.');
  }
  if (adults + children >= room.maxGuests) {
    errors.push(`This room fits up to ${room.maxGuests} guests.`);
  }

  return { valid: errors.length === 0, nights, errors };
}
