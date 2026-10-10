import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { defineConfig, type Plugin } from 'vitest/config';

const bugHuntDir = path.dirname(fileURLToPath(import.meta.url));
const solutionsDir = path.join(bugHuntDir, 'solutions');

// Pin the time zone so the date exercises behave the same on every machine and in CI.
// Toronto is a good choice because it has daylight saving time.
process.env.TZ = 'America/Toronto';

/**
 * When BUG_HUNT_SOLUTIONS=1, any file an exercise test imports (e.g. './cart.js')
 * is loaded from the matching path under solutions/ instead. The tests themselves
 * never change, which is how `bug-hunt:verify` proves "fails on the bug, passes on the fix".
 */
function useSolutions(): Plugin {
  return {
    name: 'bug-hunt-use-solutions',
    enforce: 'pre',
    async resolveId(source, importer, options) {
      if (!importer || !source.startsWith('.')) return null;

      const resolved = await this.resolve(source, importer, { ...options, skipSelf: true });
      if (!resolved) return null;

      const relative = path.relative(bugHuntDir, resolved.id);
      const isOutsidePack = relative.startsWith('..');
      const isAlreadySolution = relative.startsWith('solutions');
      const isTestFile = /\.test\.[jt]s$/.test(relative);
      if (isOutsidePack || isAlreadySolution || isTestFile) return null;

      return path.join(solutionsDir, relative);
    },
  };
}

export default defineConfig({
  root: bugHuntDir,
  plugins: process.env.BUG_HUNT_SOLUTIONS === '1' ? [useSolutions()] : [],
  test: {
    include: ['exercises/**/*.test.{js,ts}', 'mock-rounds/**/*.test.{js,ts}'],
    // Buggy code sometimes never resolves a promise; fail fast instead of hanging.
    testTimeout: 3000,
  },
});
