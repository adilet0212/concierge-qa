// "Pool, Spa and Gym" on the property card.
export function amenitySentence(amenities) {
  if (amenities.length === 0) return '';
  if (amenities.length === 1) return amenities[0];

  // Fixed: slice's end index is exclusive, so "all but the last" is slice(0, length - 1).
  const allButLast = amenities.slice(0, -1);
  const last = amenities[amenities.length - 1];
  return `${allButLast.join(', ')} and ${last}`;
}
