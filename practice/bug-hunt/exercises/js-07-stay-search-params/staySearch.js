// Pre-fills the stay search form from a shared link.
export function parseStaySearch(queryString) {
  const params = new URLSearchParams(queryString);
  const adults = params.get('adults') ?? 1;
  const children = params.get('children') ?? 0;
  const nights = params.get('nights') ?? 1;

  return {
    adults,
    children,
    nights,
    totalGuests: adults + children,
  };
}
