// Data shapes shared by the API and the web app.
// Money is always an integer in the currency's MINOR unit (cents for CAD/EUR/USD/AED, yen for JPY),
// so no floating-point rounding errors can creep into prices.

/** Text with one value per locale code, e.g. { en: 'Caesar salad', fr: 'Salade César' }. */
export type LocalizedText = Record<string, string>;

export interface RoomType {
  id: string;
  name: LocalizedText;
  maxGuests: number;
  nightlyRate: number;
}

export interface MenuItem {
  id: string;
  name: LocalizedText;
  price: number;
}

export interface SpaTreatment {
  id: string;
  name: LocalizedText;
  durationMinutes: number;
  price: number;
}

export interface Property {
  id: string;
  name: string;
  city: LocalizedText;
  country: LocalizedText;
  timeZone: string; // IANA zone, e.g. "Asia/Tokyo"
  currency: string; // ISO 4217 code, e.g. "JPY"
  checkInTime: string; // local wall-clock time, "15:00"
  checkOutTime: string; // local wall-clock time, "12:00"
  roomTaxRate: number;
  nightlyFee: number;
  diningTaxRate: number;
  serviceChargeRate: number;
  roomTypes: RoomType[];
  menu: MenuItem[];
  spaTreatments: SpaTreatment[];
}

export interface Guest {
  email: string;
  name: string;
}

export interface RoomPricing {
  nightlyRate: number;
  nights: number;
  roomSubtotal: number;
  taxes: number;
  fees: number;
  total: number;
}

export interface Booking {
  reference: string;
  guestEmail: string;
  propertyId: string;
  roomTypeId: string;
  checkIn: string; // YYYY-MM-DD, property local date
  checkOut: string; // YYYY-MM-DD, property local date
  checkInAt: string; // ISO instant (UTC) of check-in time at the property
  checkOutAt: string; // ISO instant (UTC) of check-out time at the property
  adults: number;
  children: number;
  currency: string;
  pricing: RoomPricing;
  createdAt: string;
}

export const ORDER_STATUSES = ['received', 'preparing', 'on-the-way', 'delivered'] as const;
export type OrderStatus = (typeof ORDER_STATUSES)[number];

export interface DiningTotals {
  subtotal: number;
  tax: number;
  serviceCharge: number;
  total: number;
}

export interface OrderLine {
  menuItemId: string;
  name: LocalizedText;
  price: number;
  quantity: number;
}

export interface StatusChange<S extends string> {
  status: S;
  at: string;
}

export interface Order {
  id: string;
  number: number;
  guestEmail: string;
  propertyId: string;
  currency: string;
  lines: OrderLine[];
  totals: DiningTotals;
  status: OrderStatus;
  history: StatusChange<OrderStatus>[];
  createdAt: string;
}

export const REQUEST_TYPES = ['extra-pillows', 'extra-towels', 'toiletries', 'late-checkout', 'housekeeping'] as const;
export type RequestType = (typeof REQUEST_TYPES)[number];

export const REQUEST_STATUSES = ['requested', 'acknowledged', 'in-progress', 'completed'] as const;
export type RequestStatus = (typeof REQUEST_STATUSES)[number];

export interface GuestRequest {
  id: string;
  guestEmail: string;
  propertyId: string;
  type: RequestType;
  note: string;
  status: RequestStatus;
  history: StatusChange<RequestStatus>[];
  createdAt: string;
}

export interface ChatMessage {
  id: string;
  from: 'guest' | 'concierge';
  /** What the guest typed (guest messages only). */
  text?: string;
  /** Translation key for canned concierge replies, so they appear in the guest's language. */
  templateKey?: string;
  sentAt: string;
}

/** Treatment start times offered every day (property local time). */
export const SPA_TIMES = ['10:00', '11:00', '12:00', '14:00', '15:00', '16:00', '17:00'];

export interface SpaBooking {
  id: string;
  guestEmail: string;
  propertyId: string;
  treatmentId: string;
  date: string;
  time: string;
  price: number;
  currency: string;
  createdAt: string;
}

/** Shape of every API error response. */
export interface ApiErrorBody {
  error: string;
  message: string;
  details?: string[];
}
