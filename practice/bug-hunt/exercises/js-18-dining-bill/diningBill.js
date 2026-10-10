// Numbers printed on the in-room dining receipt. Prices are in dollars.
export function calculateBill(items, taxRate) {
  const subtotal = items.reduce((sum, item) => sum + item.price * item.quantity, 0);
  const tax = subtotal * taxRate;
  const total = subtotal + tax;
  return { subtotal, tax, total };
}
