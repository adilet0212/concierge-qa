// "From $___ per night" on the property card.
// Offers come from the rates service; sold-out offers have `available: false`.
export function cheapestRate(offers) {
  const bookable = offers.filter((offer) => offer.available !== false);
  if (bookable.length === 0) {
    return null; // the card shows "Sold out" instead of a price
  }

  const rates = bookable.map((offer) => offer.nightlyRate);
  rates.sort();
  return rates[0];
}
