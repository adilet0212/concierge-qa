import { describe, expect, it } from 'vitest';
import { openOrdersOldestFirst } from './kitchenQueue.js';

const ordersByOutlet = {
  'in-room-dining': [
    { id: 'IRD-2', outlet: 'in-room-dining', placedAt: '2026-05-01T10:05:00Z' },
    { id: 'IRD-1', outlet: 'in-room-dining', placedAt: '2026-05-01T10:01:00Z' },
  ],
  'pool-bar': [{ id: 'PB-1', outlet: 'pool-bar', placedAt: '2026-05-01T10:03:00Z' }],
};

const fetchOrders = (outlet) => new Promise((resolve) => setTimeout(() => resolve(ordersByOutlet[outlet]), 5));

describe('openOrdersOldestFirst', () => {
  it('combines every outlet, oldest order first', async () => {
    const orders = await openOrdersOldestFirst(['in-room-dining', 'pool-bar'], fetchOrders);
    expect(orders.map((order) => order.id)).toEqual(['IRD-1', 'PB-1', 'IRD-2']);
  });
});
