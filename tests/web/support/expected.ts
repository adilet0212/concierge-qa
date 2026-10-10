import type { TestDish, TestProperty } from './test-data.ts';

// The "oracle": what the business rules say a price should be, written straight from the
// requirements (not copied from the app). Amounts are integers in the currency's minor unit,
// and each percentage is rounded once to the nearest minor unit.

export function expectedRoomPrice(property: TestProperty, nights: number) {
  const nightlyRate = property.testRoom.nightlyRate;
  const roomSubtotal = nightlyRate * nights;
  const taxes = Math.round(roomSubtotal * property.roomTaxRate);
  const fees = property.nightlyFee * nights;
  return { nightlyRate, roomSubtotal, taxes, fees, total: roomSubtotal + taxes + fees };
}

/** Tax and service charge are each calculated on the food subtotal (service is NOT charged on tax). */
export function expectedDiningBill(property: TestProperty, dishes: TestDish[] = property.testOrder) {
  const subtotal = dishes.reduce((sum, dish) => sum + dish.price * dish.quantity, 0);
  const tax = Math.round(subtotal * property.diningTaxRate);
  const serviceCharge = Math.round(subtotal * property.serviceChargeRate);
  return { subtotal, tax, serviceCharge, total: subtotal + tax + serviceCharge };
}
