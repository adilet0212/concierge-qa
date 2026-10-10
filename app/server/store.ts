import type { Booking, ChatMessage, Guest, GuestRequest, Order, SpaBooking } from '../shared/types.ts';

// In-memory "database". It lives as long as the server process, which is all a demo needs.
// Tests never share data: each test creates its own guest (unique email), so they can run in parallel.

export interface PendingCode {
  email: string;
  code: string;
  expiresAt: number; // epoch milliseconds
}

export const store = {
  codes: new Map<string, PendingCode>(), // by email
  sessions: new Map<string, string>(), // token -> guest email
  guests: new Map<string, Guest>(), // by email
  bookings: new Map<string, Booking>(), // by reference
  orders: new Map<string, Order>(), // by id
  orderIdsByIdempotencyKey: new Map<string, string>(),
  requests: new Map<string, GuestRequest>(), // by id
  chats: new Map<string, ChatMessage[]>(), // by `${email}:${propertyId}`
  spaBookings: new Map<string, SpaBooking>(), // by id
  nextOrderNumber: 1001,
};

/** Wipes everything. Only called once before a test run (POST /api/test/reset), never by individual tests. */
export function resetStore(): void {
  store.codes.clear();
  store.sessions.clear();
  store.guests.clear();
  store.bookings.clear();
  store.orders.clear();
  store.orderIdsByIdempotencyKey.clear();
  store.requests.clear();
  store.chats.clear();
  store.spaBookings.clear();
  store.nextOrderNumber = 1001;
}
