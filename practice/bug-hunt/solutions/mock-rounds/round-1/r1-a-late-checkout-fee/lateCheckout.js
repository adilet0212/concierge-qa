// Fee (in dollars) for checking out after the standard 12:00 checkout.
export function lateCheckoutFee(guest, checkoutHour, roomNeededToday) {
  if (checkoutHour <= 12) return 0;

  // Fixed: a tier can never be 'gold' AND 'platinum' at once, so && was always false.
  const isEliteMember = guest.tier === 'gold' || guest.tier === 'platinum';
  if (isEliteMember || !roomNeededToday) return 0;

  return checkoutHour <= 14 ? 50 : 100;
}
