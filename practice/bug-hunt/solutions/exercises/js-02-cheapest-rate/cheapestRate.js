// "From $___ per night" on the property card.
export function cheapestRate(offers) {
  const rates = offers.map((offer) => offer.nightlyRate);
  // Fixed: sort() compares strings by default ("1200" < "300"). Use a numeric comparator.
  rates.sort((a, b) => a - b);
  return rates[0];
}
