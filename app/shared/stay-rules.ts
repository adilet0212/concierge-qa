import { isIsoDate, nightsBetween } from './dates.ts';
import { isBugOn } from './seeded-bugs.ts';

// Booking rules shared by the booking form (instant feedback) and the API (the real gate).

export const MAX_NIGHTS = 30;

export type StayError =
  | 'invalidDate'
  | 'checkInPast'
  | 'checkOutNotAfterCheckIn'
  | 'tooManyNights'
  | 'noAdults'
  | 'tooManyGuests';

export interface StayInput {
  checkIn: string;
  checkOut: string;
  adults: number;
  children: number;
  maxGuests: number;
  today: string; // today's date at the property
}

function minimumNights(): number {
  // SEEDED BUG #2: a stay must be at least one night. The buggy version accepts 0 nights,
  // i.e. checking out on the same day as checking in.
  return isBugOn(2) ? 0 : 1;
}

/** Can the guest pick `day` as the check-out date? Used to disable days in the date picker. */
export function isCheckOutSelectable(day: string, checkIn: string): boolean {
  const nights = nightsBetween(checkIn, day);
  return nights >= minimumNights() && nights <= MAX_NIGHTS;
}

export function validateStay(input: StayInput): StayError[] {
  if (!isIsoDate(input.checkIn) || !isIsoDate(input.checkOut)) return ['invalidDate'];

  const errors: StayError[] = [];
  const nights = nightsBetween(input.checkIn, input.checkOut);

  if (input.checkIn < input.today) errors.push('checkInPast');
  if (nights < minimumNights()) errors.push('checkOutNotAfterCheckIn');
  if (nights > MAX_NIGHTS) errors.push('tooManyNights');
  if (input.adults < 1) errors.push('noAdults');
  if (input.adults + input.children > input.maxGuests) errors.push('tooManyGuests');

  return errors;
}
