import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

// Test data lives in /test-data as JSON. Adding a property or a language there
// automatically adds test cases: the data-driven specs loop over these lists.

export const BASE_URL = process.env.BASE_URL ?? 'http://localhost:4300';

export interface TestDish {
  dishId: string;
  price: number; // minor units (cents, or yen)
  quantity: number;
}

export interface TestProperty {
  id: string;
  name: string;
  timeZone: string;
  currency: string;
  roomTaxRate: number;
  nightlyFee: number;
  diningTaxRate: number;
  serviceChargeRate: number;
  testRoom: { id: string; nightlyRate: number; maxGuests: number };
  testOrder: TestDish[];
}

export interface TestLocale {
  code: string;
  name: string;
  signInTitle: string;
  propertiesTitle: string;
  confirmationTitle: string;
}

const repoRoot = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..', '..', '..');

function readJson<T>(relativePath: string): T {
  return JSON.parse(fs.readFileSync(path.join(repoRoot, relativePath), 'utf8')) as T;
}

export const properties = readJson<TestProperty[]>('test-data/properties.json');
export const locales = readJson<TestLocale[]>('test-data/locales.json');

export function property(id: string): TestProperty {
  const found = properties.find((p) => p.id === id);
  if (!found) throw new Error(`No property "${id}" in test-data/properties.json`);
  return found;
}

/**
 * Every translation key the app knows (from its English locale file). If one of these
 * strings shows up as visible text, the page is showing a raw key instead of a translation.
 */
export const translationKeys = Object.keys(readJson<Record<string, string>>('app/web/src/locales/en.json'));
