import { isBugOn } from './seeded-bugs.ts';
import type { DiningTotals, RoomPricing } from './types.ts';

// All amounts are integers in the currency's minor unit (see types.ts).
// Percentages are rounded once, to the nearest minor unit.

export function roomPricing(nightlyRate: number, nights: number, roomTaxRate: number, nightlyFee: number): RoomPricing {
  const roomSubtotal = nightlyRate * nights;
  const taxes = Math.round(roomSubtotal * roomTaxRate);
  const fees = nightlyFee * nights;
  return { nightlyRate, nights, roomSubtotal, taxes, fees, total: roomSubtotal + taxes + fees };
}

export function diningTotals(
  lines: { price: number; quantity: number }[],
  diningTaxRate: number,
  serviceChargeRate: number,
): DiningTotals {
  const subtotal = lines.reduce((sum, line) => sum + line.price * line.quantity, 0);
  const tax = Math.round(subtotal * diningTaxRate);

  // SEEDED BUG #1: the service charge must be calculated on the food subtotal only.
  // The buggy version charges service on subtotal + tax.
  const serviceBase = isBugOn(1) ? subtotal + tax : subtotal;
  const serviceCharge = Math.round(serviceBase * serviceChargeRate);

  return { subtotal, tax, serviceCharge, total: subtotal + tax + serviceCharge };
}
