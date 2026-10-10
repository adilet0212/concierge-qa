// Labels for the in-room dining menu.
export function menuLabels(dishes) {
  return dishes.map((dish) => {
    const price = (dish.priceCents / 100).toFixed(2);
    `${dish.name} · $${price}`;
  });
}
