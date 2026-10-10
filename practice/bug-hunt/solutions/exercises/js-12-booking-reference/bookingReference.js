// Checked before calling GET /api/bookings/:reference.
export function normalizeReference(input) {
  return input.trim().toUpperCase();
}

export function isValidReference(input) {
  // Fixed: ^ and $ anchor the pattern so the WHOLE string must match, not just part of it.
  return /^AUR-[A-Z0-9]{6}$/.test(normalizeReference(input));
}
