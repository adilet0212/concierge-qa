// Creates one booking per guest from the group coordinator's template.
export function createRoomBooking(template, guestName, extraRequests = []) {
  const booking = { ...template };
  booking.guestName = guestName;
  extraRequests.forEach((request) => booking.extras.push(request));
  return booking;
}
