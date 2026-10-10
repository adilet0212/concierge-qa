import { describe, expect, it } from 'vitest';
import { fetchBookingSummary, totalWithResortFee } from './bookingSummary.ts';

// A fake fetch that returns exactly what the real booking service sends.
function fakeFetch(body: unknown, status = 200): typeof fetch {
  return async () => new Response(JSON.stringify(body), { status });
}

describe('booking summary', () => {
  it('adds the resort fee to the room total', async () => {
    const fetchFn = fakeFetch({ reference: 'AUR-4F7K2Q', roomTotal: '1350.00', currency: 'CAD' });
    const summary = await fetchBookingSummary(fetchFn, 'AUR-4F7K2Q');
    expect(totalWithResortFee(summary, 45)).toBe(1395);
  });

  it('handles cents', async () => {
    const fetchFn = fakeFetch({ reference: 'AUR-7Y2M9D', roomTotal: '980.50', currency: 'EUR' });
    const summary = await fetchBookingSummary(fetchFn, 'AUR-7Y2M9D');
    expect(totalWithResortFee(summary, 30)).toBe(1010.5);
  });

  it('exposes the room total as a number', async () => {
    const fetchFn = fakeFetch({ reference: 'AUR-4F7K2Q', roomTotal: '1350.00', currency: 'CAD' });
    const summary = await fetchBookingSummary(fetchFn, 'AUR-4F7K2Q');
    expect(typeof summary.roomTotal).toBe('number');
  });

  it('throws a helpful error when the booking does not exist', async () => {
    await expect(fetchBookingSummary(fakeFetch({ error: 'Not found' }, 404), 'AUR-000000')).rejects.toThrow(
      'Booking AUR-000000 could not be loaded (HTTP 404)',
    );
  });
});
