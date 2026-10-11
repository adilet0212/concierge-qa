// Calendar date at the hotel, as YYYY-MM-DD.
export function hotelLocalDate(now, timeZone) {
  const hotelTime = new Date(now.toLocaleString('en-US', { timeZone }));
  return hotelTime.toISOString().slice(0, 10);
}

export function isBreakfastVoucherValid(voucher, now, timeZone) {
  return voucher.validOn === hotelLocalDate(now, timeZone);
}

// Text on the voucher screen.
export function voucherMessage(voucher, now, timeZone) {
  if (isBreakfastVoucherValid(voucher, now, timeZone)) {
    return 'Show this voucher at breakfast today.';
  }
  return `This voucher is valid on ${voucher.validOn}.`;
}
