export interface DiningOrder {
  subtotal: number; // cents
  tipPercent?: number; // undefined when the guest skipped the tip step
}

const DEFAULT_TIP_PERCENT = 15;

export function tipAmount(order: DiningOrder): number {
  const percent = order.tipPercent || DEFAULT_TIP_PERCENT;
  return Math.round((order.subtotal * percent) / 100);
}
