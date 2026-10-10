// Morning job: remind every guest leaving today.
export async function sendCheckoutReminders(guests, sendEmail) {
  let sent = 0;

  guests.forEach(async (guest) => {
    await sendEmail(guest.email, 'Checkout is at 12:00 today. Reply LATE to request a late checkout.');
    sent += 1;
  });

  return { sent };
}
