// "Pool, Spa and Gym" on the property card.
export function amenitySentence(amenities) {
  if (amenities.length === 0) return '';
  if (amenities.length === 1) return amenities[0];

  const allButLast = amenities.slice(0, amenities.length - 2);
  const last = amenities[amenities.length - 1];
  return `${allButLast.join(', ')} and ${last}`;
}
