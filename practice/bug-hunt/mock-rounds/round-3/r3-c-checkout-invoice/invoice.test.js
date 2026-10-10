import { describe, expect, it } from 'vitest';
import { buildInvoice } from './invoice.js';

const extras = [
  { description: 'Dinner, in-room dining', unitPrice: 9500, quantity: 1 },
  { description: 'Spa, 60-minute massage', unitPrice: 18000, quantity: 1 },
];
const options = { taxRate: 0.13, currency: 'CAD', locale: 'en-CA' };

describe('buildInvoice', () => {
  it('gives loyalty members 10% off the room only', () => {
    const invoice = buildInvoice({ nights: 2, nightlyRate: 40000, isLoyaltyMember: true }, extras, options);
    expect(invoice).toMatchObject({ subtotal: 107500, discount: 8000, tax: 12935, total: 112435 });
  });

  it('charges non-members the full price', () => {
    const invoice = buildInvoice({ nights: 2, nightlyRate: 40000, isLoyaltyMember: false }, extras, options);
    expect(invoice).toMatchObject({ subtotal: 107500, discount: 0, tax: 13975, total: 121475 });
  });

  it('formats amounts in dollars', () => {
    const invoice = buildInvoice({ nights: 2, nightlyRate: 40000, isLoyaltyMember: true }, extras, options);
    expect(invoice.lines.map((line) => line.formatted)).toEqual(['$800.00', '$95.00', '$180.00']);
    expect(invoice.formattedTotal).toBe('$1,124.35');
  });
});
