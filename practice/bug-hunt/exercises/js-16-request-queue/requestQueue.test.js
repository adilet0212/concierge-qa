import { describe, expect, it } from 'vitest';
import { RequestQueue } from './requestQueue.js';

describe('RequestQueue', () => {
  it('adds a single request', () => {
    const queue = new RequestQueue();
    queue.add({ room: 1204, text: 'Extra pillows' });
    expect(queue.next()).toEqual({ room: 1204, text: 'Extra pillows', receivedAt: 1 });
  });

  it('adds several requests at once, in order', () => {
    const queue = new RequestQueue();
    queue.addAll([
      { room: 1204, text: 'Extra pillows' },
      { room: 802, text: 'Taxi at 7am' },
    ]);

    expect(queue.next()).toEqual({ room: 1204, text: 'Extra pillows', receivedAt: 1 });
    expect(queue.next()).toEqual({ room: 802, text: 'Taxi at 7am', receivedAt: 2 });
  });
});
