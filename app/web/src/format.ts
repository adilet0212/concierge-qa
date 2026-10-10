import { useEffect, useState } from 'react';
import { zonedParts } from '../../shared/dates.ts';
import { isBugOn } from '../../shared/seeded-bugs.ts';

// Formatting helpers. All of them use Intl, so dates, numbers and currencies
// follow the selected language automatically (e.g. "1 234,56 €" in French).

/** Decimal places of a currency: 2 for CAD/EUR/USD/AED, 0 for JPY. */
export function currencyDigits(currency: string): number {
  return new Intl.NumberFormat('en', { style: 'currency', currency }).resolvedOptions().maximumFractionDigits ?? 2;
}

/** amount is in the currency's minor unit (cents, or yen for JPY). */
export function formatMoney(amount: number, currency: string, locale: string): string {
  return new Intl.NumberFormat(locale, { style: 'currency', currency }).format(amount / 10 ** currencyDigits(currency));
}

export function formatPercent(rate: number, locale: string): string {
  return new Intl.NumberFormat(locale, { style: 'percent', maximumFractionDigits: 1 }).format(rate);
}

/** A calendar date such as "Mon, Nov 2, 2026". Date-only values are formatted in UTC so they never shift. */
export function formatCalendarDate(isoDate: string, locale: string, style: 'medium' | 'full' = 'medium'): string {
  return new Intl.DateTimeFormat(locale, { dateStyle: style, timeZone: 'UTC' }).format(new Date(`${isoDate}T12:00:00Z`));
}

export function formatMonth(yearMonth: string, locale: string): string {
  return new Intl.DateTimeFormat(locale, { year: 'numeric', month: 'long', timeZone: 'UTC' }).format(
    new Date(`${yearMonth}-15T12:00:00Z`),
  );
}

/** The current time at a property, e.g. "3:45 PM" in Tokyo. */
export function formatPropertyTime(timeZone: string, locale: string, now: Date): string {
  return new Intl.DateTimeFormat(locale, { timeZone, hour: 'numeric', minute: '2-digit' }).format(now);
}

/**
 * A check-in or check-out moment for display. It MUST be shown in the property's time zone:
 * a guest in Toronto booking Tokyo needs Tokyo's date and time.
 */
export function stayDateTime(instant: string, propertyTimeZone: string, locale: string) {
  // SEEDED BUG #3: the buggy version leaves out the time zone, so Intl uses the
  // browser's zone (off by a day for Tokyo when viewed from North America).
  const timeZone = isBugOn(3) ? undefined : propertyTimeZone;
  const date = new Date(instant);
  const { date: localDate, time: localTime } = zonedParts(date, timeZone);
  const label = new Intl.DateTimeFormat(locale, { dateStyle: 'full', timeStyle: 'short', timeZone }).format(date);
  return { label, localDate, localTime };
}

/** The current time, refreshed every `intervalMs`, for live clocks. */
export function useNow(intervalMs = 30_000): Date {
  const [now, setNow] = useState(() => new Date());
  useEffect(() => {
    const timer = window.setInterval(() => setNow(new Date()), intervalMs);
    return () => window.clearInterval(timer);
  }, [intervalMs]);
  return now;
}
