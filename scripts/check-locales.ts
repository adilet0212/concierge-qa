/**
 * Static localization check (no browser needed): every locale file must have exactly the
 * same keys as the English one. Catches a forgotten translation the moment it is committed.
 *
 *   npm run lint:locales
 *
 * The browser tests (tests/web/specs/localization.spec.ts) then check what guests actually see.
 */
import fs from 'node:fs';
import path from 'node:path';

const localesDir = path.join(process.cwd(), 'app', 'web', 'src', 'locales');
const read = (file: string): Record<string, string> => JSON.parse(fs.readFileSync(path.join(localesDir, file), 'utf8'));

const englishKeys = Object.keys(read('en.json'));
let problems = 0;

for (const file of fs.readdirSync(localesDir).filter((f) => f.endsWith('.json') && f !== 'en.json')) {
  const dictionary = read(file);
  const keys = Object.keys(dictionary);
  const missing = englishKeys.filter((key) => !keys.includes(key));
  const extra = keys.filter((key) => !englishKeys.includes(key));
  const empty = keys.filter((key) => dictionary[key].trim() === '');

  for (const key of missing) console.error(`✘ ${file}: missing "${key}"`);
  for (const key of extra) console.error(`✘ ${file}: "${key}" does not exist in en.json`);
  for (const key of empty) console.error(`✘ ${file}: "${key}" is empty`);
  problems += missing.length + extra.length + empty.length;
  if (missing.length + extra.length + empty.length === 0) console.log(`✔ ${file}: all ${englishKeys.length} keys translated`);
}

process.exit(problems > 0 ? 1 : 0);
