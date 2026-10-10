// Loads everything the property details screen needs.
export async function loadPropertyWithRooms(fetchJson, propertyId) {
  // Fixed: the inner promise was never returned, so the outer promise resolved before the
  // rooms arrived and a failed rooms request became an unhandled rejection.
  // async/await keeps both requests in one chain.
  const property = await fetchJson(`/api/properties/${propertyId}`);
  const rooms = await fetchJson(`/api/properties/${propertyId}/rooms`);
  return { ...property, rooms };
}
