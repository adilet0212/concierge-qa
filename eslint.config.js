import js from '@eslint/js';
import { defineConfig } from 'eslint/config';
import wdio from 'eslint-plugin-wdio';
import globals from 'globals';
import tseslint from 'typescript-eslint';

export default defineConfig(
  {
    ignores: [
      'node_modules/',
      'reports/',
      'apps/',
      'app/web/dist/',
      // The bug-hunt exercises contain deliberate bugs (==, var, missing await...).
      // Linting them would flag the very things the practice pack wants you to find.
      'practice/bug-hunt/exercises/',
      'practice/bug-hunt/mock-rounds/',
      'practice/bug-hunt/solutions/',
    ],
  },
  js.configs.recommended,
  tseslint.configs.recommended,
  {
    languageOptions: { globals: { ...globals.node } },
  },
  {
    // Browser code, plus test helpers whose callbacks run inside the browser (browser.execute).
    files: ['app/web/**/*.{ts,tsx}', 'practice/bug-hunt/support/**/*.js'],
    languageOptions: { globals: { ...globals.browser } },
  },
  {
    // WebdriverIO rules: these turn our "no hard sleeps" and "always await"
    // conventions into lint errors instead of code-review comments.
    files: ['tests/**/*.ts'],
    ...wdio.configs['flat/recommended'],
    rules: {
      ...wdio.configs['flat/recommended'].rules,
      'wdio/await-expect': 'error',
      'wdio/no-pause': 'error',
      'wdio/no-debug': 'error',
    },
  },
);
