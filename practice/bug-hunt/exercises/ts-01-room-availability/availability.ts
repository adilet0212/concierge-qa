export interface Stay {
  checkIn: string; // YYYY-MM-DD
  checkOut: string; // YYYY-MM-DD
}

export interface Reservation extends Stay {
  roomNumber: number;
}

// ISO dates compare correctly as strings: '2026-05-10' < '2026-05-13'.
export function staysOverlap(a: Stay, b: Stay): boolean {
  return a.checkIn <= b.checkOut || b.checkIn <= a.checkOut;
}

export function isRoomFree(roomNumber: number, requested: Stay, reservations: Reservation[]): boolean {
  return !reservations.some(
    (reservation) => reservation.roomNumber === roomNumber && staysOverlap(reservation, requested),
  );
}
