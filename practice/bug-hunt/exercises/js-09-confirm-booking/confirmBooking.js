// Confirms a pending booking and returns its reference.
export async function confirmBooking(api, bookingId) {
  const booking = api.getBooking(bookingId);

  if (booking.status !== 'pending') {
    throw new Error(`Booking ${bookingId} cannot be confirmed (status: ${booking.status})`);
  }

  await api.updateStatus(bookingId, 'confirmed');
  return booking.reference;
}
