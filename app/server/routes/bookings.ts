import { randomInt } from 'node:crypto';
import { Router } from 'express';
import { nightsBetween, todayInZone, zonedTimeToUtc } from '../../shared/dates.ts';
import { roomPricing } from '../../shared/pricing.ts';
import { validateStay } from '../../shared/stay-rules.ts';
import type { Booking } from '../../shared/types.ts';
import { findProperty } from '../catalog.ts';
import { currentGuest, requireGuest, sendError } from '../http.ts';
import { store } from '../store.ts';

export const bookingRoutes = Router();
bookingRoutes.use(requireGuest);

const REFERENCE_CHARACTERS = 'ABCDEFGHJKLMNPQRSTUVWXYZ23456789'; // no 0/O or 1/I: easy to read aloud

function newReference(): string {
  let reference: string;
  do {
    reference = 'AUR-';
    for (let i = 0; i < 6; i++) reference += REFERENCE_CHARACTERS[randomInt(REFERENCE_CHARACTERS.length)];
  } while (store.bookings.has(reference)); // try again in the (unlikely) case it's taken
  return reference;
}

bookingRoutes.post('/', (req, res) => {
  const { propertyId, roomTypeId, checkIn, checkOut } = req.body ?? {};
  const adults = Number(req.body?.adults);
  const children = Number(req.body?.children ?? 0);

  const property = findProperty(String(propertyId));
  if (!property) {
    sendError(res, 404, 'PROPERTY_NOT_FOUND', 'We could not find that property.');
    return;
  }
  const roomType = property.roomTypes.find((room) => room.id === roomTypeId);
  if (!roomType) {
    sendError(res, 400, 'VALIDATION_FAILED', 'Please check your booking details.', ['roomTypeId']);
    return;
  }
  if (!Number.isInteger(adults) || !Number.isInteger(children) || children < 0) {
    sendError(res, 400, 'VALIDATION_FAILED', 'Please check your booking details.', ['guests']);
    return;
  }

  // The same rules the booking form uses. "Today" is today at the property, not on the server.
  const errors = validateStay({
    checkIn,
    checkOut,
    adults,
    children,
    maxGuests: roomType.maxGuests,
    today: todayInZone(property.timeZone),
  });
  if (errors.length > 0) {
    sendError(res, 400, 'VALIDATION_FAILED', 'Please check your booking details.', errors);
    return;
  }

  const guest = currentGuest(res);
  const nights = nightsBetween(checkIn, checkOut);
  const booking: Booking = {
    reference: newReference(),
    guestEmail: guest.email,
    propertyId: property.id,
    roomTypeId: roomType.id,
    checkIn,
    checkOut,
    // Stored as exact instants so any screen can show them in the property's time zone.
    checkInAt: zonedTimeToUtc(checkIn, property.checkInTime, property.timeZone),
    checkOutAt: zonedTimeToUtc(checkOut, property.checkOutTime, property.timeZone),
    adults,
    children,
    currency: property.currency,
    pricing: roomPricing(roomType.nightlyRate, nights, property.roomTaxRate, property.nightlyFee),
    createdAt: new Date().toISOString(),
  };

  store.bookings.set(booking.reference, booking);
  res.status(201).json(booking);
});

bookingRoutes.get('/', (_req, res) => {
  const guest = currentGuest(res);
  res.json([...store.bookings.values()].filter((booking) => booking.guestEmail === guest.email));
});

bookingRoutes.get('/:reference', (req, res) => {
  const booking = store.bookings.get(req.params.reference.toUpperCase());
  // Another guest's booking gets the same 404 as a missing one, so references can't be probed.
  if (!booking || booking.guestEmail !== currentGuest(res).email) {
    sendError(res, 404, 'BOOKING_NOT_FOUND', 'We could not find that booking.');
    return;
  }
  res.json(booking);
});
