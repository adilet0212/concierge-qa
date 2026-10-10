import { randomUUID } from 'node:crypto';
import { Router } from 'express';
import { isIsoDate, todayInZone } from '../../shared/dates.ts';
import { SPA_TIMES, type SpaBooking } from '../../shared/types.ts';
import { findProperty } from '../catalog.ts';
import { currentGuest, requireGuest, sendError } from '../http.ts';
import { store } from '../store.ts';

// Spa booking. This feature deliberately has no automated tests (see docs/MAKE_IT_YOURS.md).
export const spaRoutes = Router();
spaRoutes.use(requireGuest);

spaRoutes.post('/bookings', (req, res) => {
  const property = findProperty(String(req.body?.propertyId));
  if (!property) {
    sendError(res, 404, 'PROPERTY_NOT_FOUND', 'We could not find that property.');
    return;
  }

  const { treatmentId, date, time } = req.body ?? {};
  const treatment = property.spaTreatments.find((t) => t.id === treatmentId);
  const details: string[] = [];
  if (!treatment) details.push('treatmentId');
  if (!isIsoDate(date) || date < todayInZone(property.timeZone)) details.push('date');
  if (!SPA_TIMES.includes(time)) details.push('time');

  const slotTaken = [...store.spaBookings.values()].some(
    (b) => b.propertyId === property.id && b.date === date && b.time === time && b.treatmentId === treatmentId,
  );
  if (slotTaken) details.push('slotTaken');

  if (details.length > 0 || !treatment) {
    sendError(res, 400, 'VALIDATION_FAILED', 'Please check your spa booking.', details);
    return;
  }

  const booking: SpaBooking = {
    id: randomUUID(),
    guestEmail: currentGuest(res).email,
    propertyId: property.id,
    treatmentId: treatment.id,
    date,
    time,
    price: treatment.price,
    currency: property.currency,
    createdAt: new Date().toISOString(),
  };
  store.spaBookings.set(booking.id, booking);
  res.status(201).json(booking);
});

spaRoutes.get('/bookings', (_req, res) => {
  const guest = currentGuest(res);
  res.json([...store.spaBookings.values()].filter((b) => b.guestEmail === guest.email));
});
