import { randomUUID } from 'node:crypto';
import { Router } from 'express';
import { REQUEST_TYPES, type GuestRequest, type RequestType } from '../../shared/types.ts';
import { findProperty } from '../catalog.ts';
import { currentGuest, requireGuest, sendError } from '../http.ts';
import { store } from '../store.ts';

// Guest requests: extra pillows, late checkout, ... Staff move them along a status timeline.
export const requestRoutes = Router();
requestRoutes.use(requireGuest);

const MAX_NOTE_LENGTH = 300;

requestRoutes.post('/', (req, res) => {
  const property = findProperty(String(req.body?.propertyId));
  const type = req.body?.type as RequestType;
  const note = String(req.body?.note ?? '').trim();

  if (!property) {
    sendError(res, 404, 'PROPERTY_NOT_FOUND', 'We could not find that property.');
    return;
  }
  if (!REQUEST_TYPES.includes(type)) {
    sendError(res, 400, 'VALIDATION_FAILED', 'Choose what you would like.', ['type']);
    return;
  }
  if (note.length > MAX_NOTE_LENGTH) {
    sendError(res, 400, 'VALIDATION_FAILED', `Notes can be up to ${MAX_NOTE_LENGTH} characters.`, ['note']);
    return;
  }

  const now = new Date().toISOString();
  const request: GuestRequest = {
    id: randomUUID(),
    guestEmail: currentGuest(res).email,
    propertyId: property.id,
    type,
    note,
    status: 'requested',
    history: [{ status: 'requested', at: now }],
    createdAt: now,
  };
  store.requests.set(request.id, request);
  res.status(201).json(request);
});

requestRoutes.get('/', (req, res) => {
  const guest = currentGuest(res);
  const propertyId = req.query.propertyId;
  res.json(
    [...store.requests.values()].filter(
      (request) => request.guestEmail === guest.email && (!propertyId || request.propertyId === propertyId),
    ),
  );
});
