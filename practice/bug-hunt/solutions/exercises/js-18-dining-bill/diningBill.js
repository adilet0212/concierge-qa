// Numbers printed on the in-room dining receipt. Prices are in dollars.
const toCents = (dollars) => Math.round(dollars * 100);

export function calculateBill(items, taxRate) {
  // Fixed: do money maths in whole cents (integers are exact), round the tax once,
  // and only convert back to dollars at the end.
  const subtotalCents = items.reduce((sum, item) => sum + toCents(item.price) * item.quantity, 0);
  const taxCents = Math.round(subtotalCents * taxRate);
  const totalCents = subtotalCents + taxCents;

  return {
    subtotal: subtotalCents / 100,
    tax: taxCents / 100,
    total: totalCents / 100,
  };
}
