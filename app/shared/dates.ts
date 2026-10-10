// Date helpers. Stay dates are plain "YYYY-MM-DD" strings in the PROPERTY's local calendar.
// Arithmetic on them is done in UTC, which has no daylight saving, so a night is always 24 hours.

const MS_PER_DAY = 24 * 60 * 60 * 1000;

function utcMidnight(isoDate: string): number {
  return Date.parse(`${isoDate}T00:00:00Z`);
}

export function isIsoDate(value: unknown): value is string {
  return typeof value === 'string' && /^\d{4}-\d{2}-\d{2}$/.test(value) && !Number.isNaN(utcMidnight(value));
}

export function addDays(isoDate: string, days: number): string {
  return new Date(utcMidnight(isoDate) + days * MS_PER_DAY).toISOString().slice(0, 10);
}

export function nightsBetween(checkIn: string, checkOut: string): number {
  return Math.round((utcMidnight(checkOut) - utcMidnight(checkIn)) / MS_PER_DAY);
}

/** Calendar parts of an instant as seen in a time zone (undefined = the runtime's own zone). */
export function zonedParts(instant: Date, timeZone: string | undefined) {
  const parts = new Intl.DateTimeFormat('en-US', {
    timeZone,
    hourCycle: 'h23',
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
    hour: '2-digit',
    minute: '2-digit',
    second: '2-digit',
  }).formatToParts(instant);
  const get = (type: string) => parts.find((part) => part.type === type)?.value ?? '00';
  return {
    date: `${get('year')}-${get('month')}-${get('day')}`,
    time: `${get('hour')}:${get('minute')}`,
    second: get('second'),
  };
}

/** Today's date at the property, e.g. it may already be tomorrow in Tokyo. */
export function todayInZone(timeZone: string, now: Date = new Date()): string {
  return zonedParts(now, timeZone).date;
}

/** How far a time zone is ahead of UTC at a given instant, in milliseconds. */
function zoneOffsetMs(instant: number, timeZone: string): number {
  const { date, time, second } = zonedParts(new Date(instant), timeZone);
  const wallClockAsUtc = Date.parse(`${date}T${time}:${second}Z`);
  return wallClockAsUtc - Math.floor(instant / 1000) * 1000;
}

/**
 * The UTC instant of a wall-clock time at the property, e.g. 15:00 on 2026-11-02 in Tokyo
 * is 2026-11-02T06:00:00.000Z. Uses Intl, so daylight saving time is handled correctly.
 */
export function zonedTimeToUtc(isoDate: string, time: string, timeZone: string): string {
  const wallClockAsUtc = Date.parse(`${isoDate}T${time}:00Z`);
  let instant = wallClockAsUtc - zoneOffsetMs(wallClockAsUtc, timeZone);
  // Second pass: the offset can differ at the real instant when a DST change is close by.
  instant = wallClockAsUtc - zoneOffsetMs(instant, timeZone);
  return new Date(instant).toISOString();
}
