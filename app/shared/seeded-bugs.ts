/**
 * SEEDED BUGS: six realistic regressions this demo app can switch on, so we can prove
 * the test suite catches real bugs (the "seeded-bug" CI job expects 6/6 to be caught).
 *
 *   BUG_MODE=on     all six bugs are on
 *   BUG_MODE=1,3    only bugs 1 and 3
 *   (unset / off)   the app is correct
 *
 * The server reads BUG_MODE from the environment; the browser gets the same setting
 * from GET /api/config. Every line of app code that behaves differently is marked
 * "SEEDED BUG #n", so `git grep "SEEDED BUG"` shows the whole bug-vs-fixed diff.
 */
export const SEEDED_BUGS = {
  1: 'In-room dining: service charge is calculated on subtotal + tax instead of the food subtotal',
  2: 'Booking: the date picker lets the guest check out on the same day they check in',
  3: 'Booking confirmation: dates are shown in the browser time zone instead of the property time zone',
  4: 'French: the confirmation title shows the raw translation key booking.confirm.title',
  5: 'In-room dining: double-clicking "Place order" creates two orders',
  6: 'Sign-in: the code field accepts only 5 digits while the server sends 6',
} as const;

export type SeededBugId = keyof typeof SEEDED_BUGS;

const ALL_BUG_IDS = Object.keys(SEEDED_BUGS).map(Number);
let enabledBugs: number[] = [];

/** Parses "on", "off", "" or a list like "1,3". Unknown numbers are ignored. */
export function parseBugMode(value: string | undefined): number[] {
  const text = (value ?? '').trim().toLowerCase();
  if (text === 'on' || text === 'true' || text === 'all') return [...ALL_BUG_IDS];
  return text
    .split(',')
    .map((part) => Number(part.trim()))
    .filter((id) => ALL_BUG_IDS.includes(id));
}

export function setEnabledBugs(ids: number[]): void {
  enabledBugs = [...ids].sort((a, b) => a - b);
}

export function getEnabledBugs(): number[] {
  return enabledBugs;
}

export function isBugOn(id: SeededBugId): boolean {
  return enabledBugs.includes(id);
}
