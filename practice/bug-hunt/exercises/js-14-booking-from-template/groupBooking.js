// Creates one booking per guest from the group coordinator's template.
export function createRoomBooking(template, guestName, extraRequests = []) {
  const booking = { ...template };
  booking.guestName = guestName;
  extraRequests.forEach((request) => booking.extras.push(request));
  return booking;
}

// Books the whole group: one booking per guest, each with their own requests.
export function createGroupBookings(template, guests) {
  return guests.map((guest) => createRoomBooking(template, guest.name, guest.requests));
}
