import { describe, expect, it } from 'vitest';
import { sendCheckoutReminders } from './checkoutReminders.js';

// A fake email service that takes a few milliseconds per email, like a real one.
function fakeEmailService() {
  const delivered = [];
  const sendEmail = (email) =>
    new Promise((resolve) => {
      setTimeout(() => {
        delivered.push(email);
        resolve();
      }, 10);
    });
  return { delivered, sendEmail };
}

const guests = [{ email: 'ines@example.com' }, { email: 'tom@example.com' }, { email: 'aiko@example.com' }];

describe('sendCheckoutReminders', () => {
  it('reports how many reminders were sent', async () => {
    const { sendEmail } = fakeEmailService();
    await expect(sendCheckoutReminders(guests, sendEmail)).resolves.toEqual({ sent: 3 });
  });

  it('finishes only after every email has gone out', async () => {
    const { delivered, sendEmail } = fakeEmailService();
    await sendCheckoutReminders(guests, sendEmail);
    expect(delivered).toHaveLength(3);
  });

  it('handles a day with no departures', async () => {
    const { sendEmail } = fakeEmailService();
    await expect(sendCheckoutReminders([], sendEmail)).resolves.toEqual({ sent: 0 });
  });
});
