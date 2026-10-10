export interface BookingSummary {
  reference: string;
  roomTotal: number;
  currency: string;
}

// GET /api/bookings/:reference
export async function fetchBookingSummary(fetchFn: typeof fetch, reference: string): Promise<BookingSummary> {
  const response = await fetchFn(`/api/bookings/${reference}`);
  if (!response.ok) {
    throw new Error(`Booking ${reference} could not be loaded (HTTP ${response.status})`);
  }
  return (await response.json()) as BookingSummary;
}

export function totalWithResortFee(summary: BookingSummary, resortFee: number): number {
  return summary.roomTotal + resortFee;
}
