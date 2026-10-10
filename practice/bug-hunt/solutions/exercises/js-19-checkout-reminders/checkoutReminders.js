// Morning job: remind every guest leaving today.
export async function sendCheckoutReminders(guests, sendEmail) {
  let sent = 0;

  // Fixed: forEach ignores the promises returned by an async callback, so the function
  // returned before any email was sent. for...of with await waits for each one.
  // (Promise.all(guests.map(...)) would also work and sends them in parallel.)
  for (const guest of guests) {
    await sendEmail(guest.email, 'Checkout is at 12:00 today. Reply LATE to request a late checkout.');
    sent += 1;
  }

  return { sent };
}
