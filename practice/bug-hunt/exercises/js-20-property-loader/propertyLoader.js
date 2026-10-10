// Loads everything the property details screen needs.
export function loadPropertyWithRooms(fetchJson, propertyId) {
  return fetchJson(`/api/properties/${propertyId}`).then((property) => {
    fetchJson(`/api/properties/${propertyId}/rooms`).then((rooms) => {
      property.rooms = rooms;
    });
    return property;
  });
}
