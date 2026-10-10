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

  const subtotal = lines.reduce((sum, line) => sum + line.amount);
  const discount = stay.isLoyaltyMember ? Math.round(subtotal * 0.1) : 0;
  const tax = Math.round((subtotal - discount) * taxRate);
  const total = subtotal - discount + tax;

  const format = (cents) => new Intl.NumberFormat(locale, { style: 'currency', currency }).format(cents);

  return {
    lines: lines.map((line) => ({ ...line, formatted: format(line.amount) })),
    subtotal,
    discount,
    tax,
    total,
    formattedTotal: format(total),
  };
}
