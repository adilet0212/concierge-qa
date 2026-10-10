// Pre-fills the stay search form from a shared link.
export function parseStaySearch(queryString) {
  const params = new URLSearchParams(queryString);
  // Fixed: URLSearchParams always returns strings, so convert to numbers before doing maths.
  const adults = Number(params.get('adults') ?? 1);
  const children = Number(params.get('children') ?? 0);
  const nights = Number(params.get('nights') ?? 1);

  return {
    adults,
    children,
    nights,
    totalGuests: adults + children,
  };
}
