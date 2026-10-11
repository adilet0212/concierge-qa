// Loads everything the property details screen needs.
export function loadPropertyWithRooms(fetchJson, propertyId) {
  return fetchJson(`/api/properties/${propertyId}`).then((property) => {
    fetchJson(`/api/properties/${propertyId}/rooms`).then((rooms) => {
      property.rooms = rooms;
    });
    return property;
  });
}

// Title of the details screen, e.g. "Aurelle Tokyo · 3 room types".
export function screenTitle(property) {
  const count = property.rooms.length;
  return `${property.name} · ${count} room ${count === 1 ? 'type' : 'types'}`;
}
