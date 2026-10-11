// Checked before calling GET /api/bookings/:reference.
export function normalizeReference(input) {
  return input.trim().toUpperCase();
}

export function isValidReference(input) {
  return /AUR-[A-Z0-9]{6}/.test(normalizeReference(input));
}

// Help text under the "Find my booking" field.
export function referenceHint(input) {
  if (normalizeReference(input) === '') {
    return 'Enter the reference from your confirmation email.';
  }
  return isValidReference(input) ? '' : 'A booking reference looks like AUR-4F7K2Q.';
}
