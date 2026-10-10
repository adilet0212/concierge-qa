import { Router } from 'express';
import { findProperty, properties } from '../catalog.ts';
import { sendError } from '../http.ts';

export const propertyRoutes = Router();

propertyRoutes.get('/', (_req, res) => {
  res.json(properties);
});

propertyRoutes.get('/:propertyId', (req, res) => {
  const property = findProperty(req.params.propertyId);
  if (!property) {
    sendError(res, 404, 'PROPERTY_NOT_FOUND', 'We could not find that property.');
    return;
  }
  res.json(property);
});
