// Small helpers shared by the WebdriverIO practice exercises.
// They call the Aurelle demo app's API directly so each test can set itself up quickly.
import { browser } from '@wdio/globals';

export const BASE_URL = process.env.BASE_URL ?? 'http://localhost:4300';

export function uniqueEmail(prefix = 'practice') {
  return `${prefix}+${Date.now()}-${Math.random().toString(36).slice(2, 8)}@aurelle.test`;
}

async function api(method, path, body, token) {
  const headers = { 'Content-Type': 'application/json' };
  if (token) headers.Authorization = `Bearer ${token}`;

  const response = await fetch(`${BASE_URL}${path}`, {
    method,
    headers,
    body: body === undefined ? undefined : JSON.stringify(body),
  });
  if (!response.ok) {
    throw new Error(`${method} ${path} failed with HTTP ${response.status}: ${await response.text()}`);
  }
  return response.status === 204 ? undefined : response.json();
}

/** Signs in through the API (request code, read it from the dev inbox, verify). */
export async function signInViaApi(email = uniqueEmail()) {
  await api('POST', '/api/auth/request-code', { email });
  const { code } = await api('GET', `/api/dev/inbox?email=${encodeURIComponent(email)}`);
  const { token } = await api('POST', '/api/auth/verify-code', { email, code });
  return { email, token };
}

/** Puts the guest's session token in the browser, then opens the page. */
export async function openAs(guest, path) {
  await browser.url('/sign-in');
  await browser.execute((token) => window.localStorage.setItem('aurelle.session', token), guest.token);
  await browser.url(path);
}

export async function openAsNewGuest(path) {
  const guest = await signInViaApi();
  await openAs(guest, path);
  return guest;
}

/** Books 3 nights, about two months from now, in the property's cheapest room. */
export async function createBooking(token, propertyId = 'toronto') {
  const checkIn = new Date(Date.now() + 60 * 24 * 60 * 60 * 1000).toISOString().slice(0, 10);
  const checkOut = new Date(Date.now() + 63 * 24 * 60 * 60 * 1000).toISOString().slice(0, 10);
  return api(
    'POST',
    '/api/bookings',
    { propertyId, roomTypeId: 'deluxe-king', checkIn, checkOut, adults: 1, children: 0 },
    token,
  );
}

export async function placeOrderViaApi(token, propertyId, items) {
  const idempotencyKey = `practice-${Date.now()}-${Math.random()}`;
  return api('POST', '/api/orders', { propertyId, items, idempotencyKey }, token);
}

export async function listOrders(token) {
  return api('GET', '/api/orders', undefined, token);
}

/** What a kitchen staff member does from their own tablet. */
export async function setOrderStatus(orderId, status) {
  return api('PATCH', `/api/staff/orders/${orderId}`, { status });
}

/** Wipes ALL data on the server, for every guest. */
export async function resetAllData() {
  return api('POST', '/api/test/reset');
}
