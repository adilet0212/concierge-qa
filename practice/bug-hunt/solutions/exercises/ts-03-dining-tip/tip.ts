export interface DiningOrder {
  subtotal: number; // cents
  tipPercent?: number; // undefined when the guest skipped the tip step
}

const DEFAULT_TIP_PERCENT = 15;

export function tipAmount(order: DiningOrder): number {
  // Fixed: `||` replaces every falsy value, including a deliberate 0.
  // `??` only replaces null/undefined, i.e. "the guest skipped the step".
  const percent = order.tipPercent ?? DEFAULT_TIP_PERCENT;
  return Math.round((order.subtotal * percent) / 100);
}
