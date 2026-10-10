// Loyalty points earned for a completed stay.
export function pointsForStay(stay) {
  // Fixed (bug 1): parseInt stops at the first non-digit, so "1,250.75" became 1.
  // Remove the thousands separators first, then drop the cents.
  const dollars = Math.floor(Number(stay.roomCharges.replaceAll(',', '')));
  let points = dollars * 10;

  // Fixed (bug 2): "3 nights or more" means >= 3.
  if (stay.nights >= 3) {
    points += 500;
  }

  return points;
}
