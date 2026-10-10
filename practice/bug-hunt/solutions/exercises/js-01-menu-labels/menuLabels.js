// Labels for the in-room dining menu.
export function menuLabels(dishes) {
  return dishes.map((dish) => {
    const price = (dish.priceCents / 100).toFixed(2);
    // Fixed: a callback with a { block } body must `return` its value.
    return `${dish.name} · $${price}`;
  });
}
