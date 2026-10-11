// Creates one booking per guest from the group coordinator's template.
export function createRoomBooking(template, guestName, extraRequests = []) {
  // Fixed: spread is a SHALLOW copy, so booking.extras was the template's array.
  // Build a new extras array instead of pushing into the shared one.
  return {
    ...template,
    guestName,
    extras: [...template.extras, ...extraRequests],
  };
}

// Books the whole group: one booking per guest, each with their own requests.
export function createGroupBookings(template, guests) {
  return guests.map((guest) => createRoomBooking(template, guest.name, guest.requests));
}
