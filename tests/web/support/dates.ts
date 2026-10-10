// Date helpers for choosing stay dates.
// Note: these are written here on purpose instead of importing the app's own helpers.
// A test that reuses the code it is testing would repeat the same mistakes.

/** Today's date (YYYY-MM-DD) at a property, e.g. it may already be tomorrow in Tokyo. */
export function todayIn(timeZone: string): string {
  const parts = new Intl.DateTimeFormat('en-US', { timeZone, year: 'numeric', month: '2-digit', day: '2-digit' }).formatToParts(
    new Date(),
  );
  const get = (type: string) => parts.find((p) => p.type === type)!.value;
  return `${get('year')}-${get('month')}-${get('day')}`;
}

export function addDays(isoDate: string, days: number): string {
  const date = new Date(`${isoDate}T00:00:00Z`);
  date.setUTCDate(date.getUTCDate() + days);
  return date.toISOString().slice(0, 10);
}

/** A stay `nights` long that starts `daysAhead` days from today at the property. */
export function futureStay(timeZone: string, daysAhead: number, nights: number) {
  const checkIn = addDays(todayIn(timeZone), daysAhead);
  return { checkIn, checkOut: addDays(checkIn, nights), nights };
}
