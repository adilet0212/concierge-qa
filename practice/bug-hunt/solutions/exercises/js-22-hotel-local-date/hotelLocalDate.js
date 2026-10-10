// Calendar date at the hotel, as YYYY-MM-DD.
export function hotelLocalDate(now, timeZone) {
  // Fixed: re-parsing the hotel's wall-clock time as if it were the PHONE's local time and
  // then calling toISOString (UTC) shifted the date by the phone's offset.
  // Ask Intl for the date parts in the hotel's zone directly.
  const parts = new Intl.DateTimeFormat('en-US', {
    timeZone,
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
  }).formatToParts(now);
  const part = (type) => parts.find((p) => p.type === type).value;
  return `${part('year')}-${part('month')}-${part('day')}`;
}

export function isBreakfastVoucherValid(voucher, now, timeZone) {
  return voucher.validOn === hotelLocalDate(now, timeZone);
}
