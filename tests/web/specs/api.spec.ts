import { expect } from '@wdio/globals';
import { api, apiRequest } from '../support/api-client.ts';
import { addDays, futureStay, todayIn } from '../support/dates.ts';
import { expectedRoomPrice } from '../support/expected.ts';
import { property } from '../support/test-data.ts';

// API tests: no browser interaction, just HTTP. They run in the same WebdriverIO runner so
// they share the data helpers and appear in the same report as the UI tests.
// They are fast and precise, so business rules are checked here as well as through the UI.

const tokyo = property('tokyo');

describe('API @regression', () => {
  it('reports that the service is healthy @smoke', async () => {
    const response = await apiRequest('GET', '/api/health');

    expect(response.status).toBe(200);
    expect(response.body).toEqual(expect.objectContaining({ status: 'ok' }));
  });

  it('rejects requests for guest data without a session', async () => {
    for (const path of ['/api/me', '/api/bookings', '/api/orders', '/api/requests']) {
      const response = await apiRequest('GET', path);
      expect(response.status).toBe(401);
      expect(response.body).toEqual({ error: 'UNAUTHORIZED', message: expect.any(String) });
    }
  });

  it('creates a booking that matches the API contract', async () => {
    const guest = await api.createGuest('contract');
    const stay = futureStay(tokyo.timeZone, 40, 3);
    const price = expectedRoomPrice(tokyo, stay.nights);

    const response = await apiRequest('POST', '/api/bookings', {
      token: guest.token,
      body: { propertyId: tokyo.id, roomTypeId: tokyo.testRoom.id, ...stay, adults: 2, children: 0 },
    });

    expect(response.status).toBe(201);
    // The contract: field names and types the mobile and web apps rely on.
    expect(response.body).toEqual(
      expect.objectContaining({
        reference: expect.stringMatching(/^AUR-[A-Z0-9]{6}$/),
        propertyId: tokyo.id,
        roomTypeId: tokyo.testRoom.id,
        checkIn: stay.checkIn,
        checkOut: stay.checkOut,
        currency: 'JPY',
        adults: 2,
        children: 0,
        pricing: { ...price, nights: stay.nights },
      }),
    );
    // 15:00 in Tokyo (UTC+9, no daylight saving) is 06:00 UTC; 12:00 is 03:00 UTC.
    expect(response.body.checkInAt).toBe(`${stay.checkIn}T06:00:00.000Z`);
    expect(response.body.checkOutAt).toBe(`${stay.checkOut}T03:00:00.000Z`);
  });

  it('rejects invalid stay dates with a 400 and the reason', async () => {
    const guest = await api.createGuest('dates');
    const today = todayIn(tokyo.timeZone);
    const cases = [
      { checkIn: addDays(today, 20), checkOut: addDays(today, 20), reason: 'checkOutNotAfterCheckIn' }, // same day
      { checkIn: addDays(today, 20), checkOut: addDays(today, 18), reason: 'checkOutNotAfterCheckIn' }, // backwards
      { checkIn: addDays(today, -2), checkOut: addDays(today, 1), reason: 'checkInPast' },
      { checkIn: addDays(today, 10), checkOut: addDays(today, 45), reason: 'tooManyNights' },
    ];

    for (const { checkIn, checkOut, reason } of cases) {
      const response = await apiRequest('POST', '/api/bookings', {
        token: guest.token,
        body: { propertyId: tokyo.id, roomTypeId: tokyo.testRoom.id, checkIn, checkOut, adults: 1 },
      });
      expect(response.status).toBe(400);
      expect(response.body.details).toContain(reason);
    }
  });

  it('rejects more guests than the room fits', async () => {
    const guest = await api.createGuest('capacity');
    const stay = futureStay(tokyo.timeZone, 30, 2);

    const response = await apiRequest('POST', '/api/bookings', {
      token: guest.token,
      body: { propertyId: tokyo.id, roomTypeId: tokyo.testRoom.id, ...stay, adults: tokyo.testRoom.maxGuests, children: 1 },
    });

    expect(response.status).toBe(400);
    expect(response.body.details).toEqual(['tooManyGuests']);
  });

  it("does not show one guest's booking to another guest", async () => {
    const owner = await api.createGuest('owner');
    const stranger = await api.createGuest('stranger');
    const stay = futureStay(tokyo.timeZone, 30, 2);
    const booking = await api.createBooking(owner, { propertyId: tokyo.id, roomTypeId: tokyo.testRoom.id, ...stay, adults: 1 });

    const asOwner = await apiRequest('GET', `/api/bookings/${booking.reference}`, { token: owner.token });
    const asStranger = await apiRequest('GET', `/api/bookings/${booking.reference}`, { token: stranger.token });

    expect(asOwner.status).toBe(200);
    // 404, not 403: a stranger shouldn't even learn that the reference exists.
    expect(asStranger.status).toBe(404);
  });

  it('treats a repeated order with the same idempotency key as one order', async () => {
    const guest = await api.createGuest('idempotent');
    const order = { propertyId: 'paris', items: [{ menuItemId: 'caesar-salad', quantity: 1 }], idempotencyKey: 'same-key-123' };

    const first = await apiRequest('POST', '/api/orders', { token: guest.token, body: order });
    const retry = await apiRequest('POST', '/api/orders', { token: guest.token, body: order });

    expect(first.status).toBe(201);
    expect(retry.status).toBe(200);
    expect(retry.body.id).toBe(first.body.id);
    expect(await api.listOrders(guest)).toHaveLength(1);
  });

  it('rejects orders with unknown dishes or invalid quantities', async () => {
    const guest = await api.createGuest('badorder');
    const invalidItems = [[{ menuItemId: 'lobster', quantity: 1 }], [{ menuItemId: 'caesar-salad', quantity: 0 }], []];

    for (const items of invalidItems) {
      const response = await apiRequest('POST', '/api/orders', {
        token: guest.token,
        body: { propertyId: 'paris', items, idempotencyKey: `bad-${Math.random()}` },
      });
      expect(response.status).toBe(400);
      expect(response.body.error).toBe('VALIDATION_FAILED');
    }
  });
});
