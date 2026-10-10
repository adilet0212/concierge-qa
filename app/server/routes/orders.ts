import { randomUUID } from 'node:crypto';
import { Router } from 'express';
import { diningTotals } from '../../shared/pricing.ts';
import type { Order, OrderLine } from '../../shared/types.ts';
import { findProperty } from '../catalog.ts';
import { currentGuest, requireGuest, sendError } from '../http.ts';
import { store } from '../store.ts';

export const orderRoutes = Router();
orderRoutes.use(requireGuest);

const MAX_QUANTITY = 20;

// A real kitchen system takes a moment to acknowledge an order. The demo waits this long
// before answering (the order is already saved), like a hotel network would. That is the window
// in which guests tap "Place order" twice, so the double-submit test is realistic and reliable.
const KITCHEN_CONFIRMATION_DELAY_MS = Number(process.env.KITCHEN_DELAY_MS ?? 400);

orderRoutes.post('/', (req, res) => {
  const guest = currentGuest(res);
  const property = findProperty(String(req.body?.propertyId));
  const items: unknown = req.body?.items;
  const idempotencyKey = typeof req.body?.idempotencyKey === 'string' ? req.body.idempotencyKey : '';

  if (!property) {
    sendError(res, 404, 'PROPERTY_NOT_FOUND', 'We could not find that property.');
    return;
  }

  // Idempotency: if the app retries (or the guest taps twice) with the same key,
  // return the order we already created instead of cooking it twice.
  const existingId = store.orderIdsByIdempotencyKey.get(`${guest.email}:${idempotencyKey}`);
  if (idempotencyKey && existingId) {
    res.status(200).json(store.orders.get(existingId));
    return;
  }

  if (!Array.isArray(items) || items.length === 0) {
    sendError(res, 400, 'VALIDATION_FAILED', 'Add at least one dish to your order.', ['items']);
    return;
  }

  const lines: OrderLine[] = [];
  for (const item of items) {
    const menuItem = property.menu.find((dish) => dish.id === item?.menuItemId);
    const quantity = Number(item?.quantity);
    if (!menuItem || !Number.isInteger(quantity) || quantity < 1 || quantity > MAX_QUANTITY) {
      sendError(res, 400, 'VALIDATION_FAILED', 'One of the dishes in your order is not valid.', ['items']);
      return;
    }
    lines.push({ menuItemId: menuItem.id, name: menuItem.name, price: menuItem.price, quantity });
  }

  const now = new Date().toISOString();
  const order: Order = {
    id: randomUUID(),
    number: store.nextOrderNumber++,
    guestEmail: guest.email,
    propertyId: property.id,
    currency: property.currency,
    lines,
    totals: diningTotals(lines, property.diningTaxRate, property.serviceChargeRate),
    status: 'received',
    history: [{ status: 'received', at: now }],
    createdAt: now,
  };

  store.orders.set(order.id, order);
  if (idempotencyKey) store.orderIdsByIdempotencyKey.set(`${guest.email}:${idempotencyKey}`, order.id);
  setTimeout(() => res.status(201).json(order), KITCHEN_CONFIRMATION_DELAY_MS);
});

orderRoutes.get('/', (req, res) => {
  const guest = currentGuest(res);
  const propertyId = req.query.propertyId;
  res.json(
    [...store.orders.values()].filter(
      (order) => order.guestEmail === guest.email && (!propertyId || order.propertyId === propertyId),
    ),
  );
});

orderRoutes.get('/:orderId', (req, res) => {
  const order = store.orders.get(req.params.orderId);
  if (!order || order.guestEmail !== currentGuest(res).email) {
    sendError(res, 404, 'ORDER_NOT_FOUND', 'We could not find that order.');
    return;
  }
  res.json(order);
});
