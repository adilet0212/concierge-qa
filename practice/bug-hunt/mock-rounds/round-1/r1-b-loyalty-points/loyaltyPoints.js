// Loyalty points earned for a completed stay.
export function pointsForStay(stay) {
  const dollars = parseInt(stay.roomCharges);
  let points = dollars * 10;

  if (stay.nights > 3) {
    points += 500;
  }

  return points;
}
