import AxeBuilder from '@axe-core/webdriverio';
import { browser } from '@wdio/globals';

// Runs axe-core (the engine behind most accessibility checkers) on the current page
// against WCAG 2.1 level A and AA rules, and returns only the violations that block or
// seriously hinder people using assistive technology. Minor/moderate issues are still
// visible in axe's full output but do not fail the build.
const WCAG_21_AA = ['wcag2a', 'wcag2aa', 'wcag21a', 'wcag21aa'];
const BLOCKING_IMPACTS = ['serious', 'critical'];

export async function seriousAccessibilityViolations(): Promise<string[]> {
  const results = await new AxeBuilder({ client: browser }).withTags(WCAG_21_AA).analyze();

  return results.violations
    .filter((violation) => BLOCKING_IMPACTS.includes(violation.impact ?? ''))
    .map(
      (violation) =>
        `[${violation.impact}] ${violation.id}: ${violation.help} (${violation.nodes.length} element(s), e.g. ${violation.nodes[0]?.target.join(' ')})`,
    );
}
