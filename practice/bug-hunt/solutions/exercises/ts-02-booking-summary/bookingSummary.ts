export interface BookingSummary {
  reference: string;
  roomTotal: number;
  currency: string;
}

// Fixed: describe what the API REALLY sends (money as decimal strings)...
interface BookingSummaryResponse {
  reference: string;
  roomTotal: string;
  currency: string;
}

// GET /api/bookings/:reference
export async function fetchBookingSummary(fetchFn: typeof fetch, reference: string): Promise<BookingSummary> {
  const response = await fetchFn(`/api/bookings/${reference}`);
  if (!response.ok) {
    throw new Error(`Booking ${reference} could not be loaded (HTTP ${response.status})`);
  }
  // ...and convert it at the boundary. `as BookingSummary` only silenced the compiler;
  // it never changed the value, so roomTotal stayed a string and `+` concatenated.
  const body = (await response.json()) as BookingSummaryResponse;
  return { ...body, roomTotal: Number(body.roomTotal) };
}

export function totalWithResortFee(summary: BookingSummary, resortFee: number): number {
  return summary.roomTotal + resortFee;
}
