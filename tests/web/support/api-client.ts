import { BASE_URL } from './test-data.ts';

// A tiny API client used two ways:
//   1. by the API specs, which check status codes and response bodies directly;
//   2. by UI specs, to create test data quickly (sign in, book, order) instead of clicking through screens.
// That layering keeps UI tests short and focused on the one screen they test.

export interface ApiResponse<T = any> {
  status: number;
  body: T;
}

export interface Guest {
  email: string;
  name: string;
  token: string;
}

export async function apiRequest<T = any>(
  method: string,
  path: string,
  options: { body?: unknown; token?: string } = {},
): Promise<ApiResponse<T>> {
  const headers: Record<string, string> = { 'Content-Type': 'application/json' };
  if (options.token) headers.Authorization = `Bearer ${options.token}`;

  const response = await fetch(`${BASE_URL}${path}`, {
    method,
    headers,
    body: options.body === undefined ? undefined : JSON.stringify(options.body),
  });
  const text = await response.text();
  return { status: response.status, body: text ? JSON.parse(text) : undefined };
}

/** Like apiRequest, but throws with a readable message unless the status is the expected one. */
async function expectStatus<T>(expected: number, method: string, path: string, options: { body?: unknown; token?: string } = {}) {
  const response = await apiRequest<T>(method, path, options);
  if (response.status !== expected) {
    throw new Error(`${method} ${path} returned ${response.status}, expected ${expected}: ${JSON.stringify(response.body)}`);
  }
  return response.body;
}

/** A unique email per test, so tests never share data and can run in parallel. */
export function uniqueEmail(prefix = 'guest'): string {
  return `${prefix}+${Date.now()}-${Math.random().toString(36).slice(2, 8)}@aurelle.test`;
}

export const api = {
  requestCode: (email: string) => expectStatus(202, 'POST', '/api/auth/request-code', { body: { email } }),

  /** Reads the one-time code from the dev inbox, like a test mailbox in a real environment. */
  readCode: async (email: string): Promise<string> =>
    (await expectStatus<{ code: string }>(200, 'GET', `/api/dev/inbox?email=${encodeURIComponent(email)}`)).code,

  expireCode: (email: string) => expectStatus(204, 'POST', '/api/test/expire-code', { body: { email } }),

  /** Signs a brand-new guest in through the API and returns their session token. */
  async createGuest(prefix = 'guest'): Promise<Guest> {
    const email = uniqueEmail(prefix);
    await api.requestCode(email);
    const code = await api.readCode(email);
    const result = await expectStatus<{ token: string; guest: { name: string } }>(200, 'POST', '/api/auth/verify-code', {
      body: { email, code },
    });
    return { email, name: result.guest.name, token: result.token };
  },

  createBooking: (
    guest: Guest,
    booking: { propertyId: string; roomTypeId: string; checkIn: string; checkOut: string; adults: number; children?: number },
  ) => expectStatus<{ reference: string; checkInAt: string; checkOutAt: string }>(201, 'POST', '/api/bookings', {
    body: { children: 0, ...booking },
    token: guest.token,
  }),

  placeOrder: (guest: Guest, propertyId: string, items: { menuItemId: string; quantity: number }[]) =>
    expectStatus<{ id: string }>(201, 'POST', '/api/orders', {
      body: { propertyId, items, idempotencyKey: `test-${Date.now()}-${Math.random()}` },
      token: guest.token,
    }),

  listOrders: (guest: Guest) => expectStatus<{ id: string }[]>(200, 'GET', '/api/orders', { token: guest.token }),

  listRequests: (guest: Guest) => expectStatus<{ id: string; status: string }[]>(200, 'GET', '/api/requests', { token: guest.token }),

  /** What a staff member does from the kitchen tablet. */
  setOrderStatus: (orderId: string, status: string) =>
    expectStatus(200, 'PATCH', `/api/staff/orders/${orderId}`, { body: { status } }),

  /** What housekeeping does from their own tool. */
  setRequestStatus: (requestId: string, status: string) =>
    expectStatus(200, 'PATCH', `/api/staff/requests/${requestId}`, { body: { status } }),
};
