import { Router } from 'express';
import { ORDER_STATUSES, REQUEST_STATUSES, type OrderStatus, type RequestStatus } from '../../shared/types.ts';
import { sendError } from '../http.ts';
import { store } from '../store.ts';

// What hotel staff do from their own tools: the kitchen updates orders, housekeeping updates requests.
// Tests use these endpoints to move things along without waiting for real people.
// (A real system would require a staff login; this demo keeps it open on purpose.)
export const staffRoutes = Router();

staffRoutes.patch('/orders/:orderId', (req, res) => {
  const order = store.orders.get(req.params.orderId);
  const status = req.body?.status as OrderStatus;
  if (!order) {
    sendError(res, 404, 'ORDER_NOT_FOUND', 'We could not find that order.');
    return;
  }
  if (!ORDER_STATUSES.includes(status)) {
    sendError(res, 400, 'VALIDATION_FAILED', `Status must be one of: ${ORDER_STATUSES.join(', ')}.`, ['status']);
    return;
  }
  order.status = status;
  order.history.push({ status, at: new Date().toISOString() });
  res.json(order);
});

staffRoutes.patch('/requests/:requestId', (req, res) => {
  const request = store.requests.get(req.params.requestId);
  const status = req.body?.status as RequestStatus;
  if (!request) {
    sendError(res, 404, 'REQUEST_NOT_FOUND', 'We could not find that request.');
    return;
  }
  if (!REQUEST_STATUSES.includes(status)) {
    sendError(res, 400, 'VALIDATION_FAILED', `Status must be one of: ${REQUEST_STATUSES.join(', ')}.`, ['status']);
    return;
  }
  request.status = status;
  request.history.push({ status, at: new Date().toISOString() });
  res.json(request);
});
