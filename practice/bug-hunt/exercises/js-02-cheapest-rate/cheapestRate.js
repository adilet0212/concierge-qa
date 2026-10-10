// "From $___ per night" on the property card.
export function cheapestRate(offers) {
  const rates = offers.map((offer) => offer.nightlyRate);
  rates.sort();
  return rates[0];
}
