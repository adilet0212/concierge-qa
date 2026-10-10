import { describe, expect, it } from 'vitest';
import { createRoomBooking } from './groupBooking.js';

function weddingTemplate() {
  return {
    propertyId: 'paris',
    checkIn: '2026-06-12',
    checkOut: '2026-06-15',
    extras: ['airport-transfer'],
  };
}

describe('createRoomBooking', () => {
  it('copies the template and adds the guest name', () => {
    const booking = createRoomBooking(weddingTemplate(), 'Ines Moreau');
    expect(booking).toMatchObject({ propertyId: 'paris', checkIn: '2026-06-12', guestName: 'Ines Moreau' });
  });

  it('gives each booking only its own extra requests', () => {
    const template = weddingTemplate();
    const a = createRoomBooking(template, 'Ines Moreau', ['crib']);
    const b = createRoomBooking(template, 'Tom Becker', ['late-checkout']);

    expect(a.extras).toEqual(['airport-transfer', 'crib']);
    expect(b.extras).toEqual(['airport-transfer', 'late-checkout']);
  });

  it('never changes the template', () => {
    const template = weddingTemplate();
    createRoomBooking(template, 'Ines Moreau', ['crib']);
    expect(template).toEqual(weddingTemplate());
  });
});
