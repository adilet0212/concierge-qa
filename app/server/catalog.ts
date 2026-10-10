import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import type { Property } from '../shared/types.ts';

// The hotel catalog (what a CMS would hold). To add a property, add an entry to
// data/properties.json and restart the server: no code changes needed.
const catalogFile = path.join(path.dirname(fileURLToPath(import.meta.url)), 'data', 'properties.json');

export const properties: Property[] = JSON.parse(fs.readFileSync(catalogFile, 'utf8'));

export function findProperty(id: string): Property | undefined {
  return properties.find((property) => property.id === id);
}
