// Final invoice printed at checkout. All amounts are in cents.
export function buildInvoice(stay, extras, { taxRate, currency, locale = 'en-CA' }) {
  const roomLine = {
    description: `Room, ${stay.nights} nights`,
    amount: stay.nightlyRate * stay.nights,
  };
  const extraLines = extras.map((extra) => ({
    description: extra.description,
    amount: extra.unitPrice * extra.quantity,
  }));
  const lines = [roomLine, ...extraLines];

  // Fixed (bug 1): without an initial value, reduce starts with the first LINE OBJECT as `sum`,
  // so the result was the string "[object Object]950018000". Start from 0.
  const subtotal = lines.reduce((sum, line) => sum + line.amount, 0);
  // Fixed (bug 2): the loyalty discount applies to the room line only.
  const discount = stay.isLoyaltyMember ? Math.round(roomLine.amount * 0.1) : 0;
  const tax = Math.round((subtotal - discount) * taxRate);
  const total = subtotal - discount + tax;

  // Fixed (bug 3): Intl.NumberFormat expects major units (dollars), not cents.
  const format = (cents) => new Intl.NumberFormat(locale, { style: 'currency', currency }).format(cents / 100);

  return {
    lines: lines.map((line) => ({ ...line, formatted: format(line.amount) })),
    subtotal,
    discount,
    tax,
    total,
    formattedTotal: format(total),
  };
}
