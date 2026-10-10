import { describe, expect, it } from 'vitest';
import { loadPropertyWithRooms } from './propertyLoader.js';

const later = (value, ms = 5) => new Promise((resolve) => setTimeout(() => resolve(value), ms));
const failLater = (error, ms = 5) => new Promise((_, reject) => setTimeout(() => reject(error), ms));

describe('loadPropertyWithRooms', () => {
  it('resolves with the rooms attached', async () => {
    const fetchJson = (url) =>
      url.endsWith('/rooms') ? later([{ id: 'deluxe-king' }]) : later({ id: 'tokyo', name: 'Aurelle Tokyo' });

    await expect(loadPropertyWithRooms(fetchJson, 'tokyo')).resolves.toEqual({
      id: 'tokyo',
      name: 'Aurelle Tokyo',
      rooms: [{ id: 'deluxe-king' }],
    });
  });

  it('rejects when the rooms request fails', async () => {
    const outage = new Error('503 Service Unavailable');
    const fetchJson = (url) => (url.endsWith('/rooms') ? failLater(outage) : later({ id: 'tokyo' }));

    await expect(loadPropertyWithRooms(fetchJson, 'tokyo')).rejects.toThrow('503 Service Unavailable');
  });
});
