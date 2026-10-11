// Labels for the in-room dining menu.
export function menuLabels(dishes) {
  return dishes.map((dish) => {
    const price = (dish.priceCents / 100).toFixed(2);
    `${dish.name} · $${price}`;
  });
}

// The line under the cart, e.g. "3 items · $54.50".
export function cartSummary(lines) {
  const count = lines.reduce((sum, line) => sum + line.quantity, 0);
  const totalCents = lines.reduce((sum, line) => sum + line.priceCents * line.quantity, 0);
  const noun = count === 1 ? 'item' : 'items';
  return `${count} ${noun} · $${(totalCents / 100).toFixed(2)}`;
}
