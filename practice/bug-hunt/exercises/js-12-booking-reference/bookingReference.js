// Checked before calling GET /api/bookings/:reference.
export function normalizeReference(input) {
  return input.trim().toUpperCase();
}

export function isValidReference(input) {
  return /AUR-[A-Z0-9]{6}/.test(normalizeReference(input));
}
