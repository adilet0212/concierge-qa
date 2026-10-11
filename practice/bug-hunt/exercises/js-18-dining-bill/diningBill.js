// Numbers printed on the in-room dining receipt. Prices are in dollars.
export function calculateBill(items, taxRate) {
  const subtotal = items.reduce((sum, item) => sum + item.price * item.quantity, 0);
  const tax = subtotal * taxRate;
  const total = subtotal + tax;
  return { subtotal, tax, total };
}

// "Delivery in 25-35 minutes": 10 to 20 minutes after the slowest dish is ready.
export function deliveryWindow(items) {
  const slowest = Math.max(...items.map((item) => item.prepMinutes ?? 15));
  return `Delivery in ${slowest + 10}-${slowest + 20} minutes`;
}
