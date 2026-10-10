// In-room dining cart used by the guest app. All prices are in cents.
export class DiningCart {
  constructor(menu, rates) {
    this.menu = menu; // [{ id, name, priceCents }]
    this.taxRate = rates.taxRate;
    this.serviceChargeRate = rates.serviceChargeRate;
    this.lines = []; // [{ id, quantity }]
  }

  add(itemId, quantity = 1) {
    if (!this.menu.some((item) => item.id === itemId)) {
      throw new Error(`Unknown menu item: ${itemId}`);
    }

    const line = this.lines.find((l) => l.id === itemId);
    if (line) {
      line.quantity = quantity;
    } else {
      this.lines.push({ id: itemId, quantity });
    }
  }

  remove(itemId) {
    const index = this.lines.findIndex((l) => l.id === itemId);
    this.lines.splice(index, 1);
  }

  itemCount() {
    return this.lines.reduce((count, line) => count + line.quantity, 0);
  }

  totals() {
    const subtotal = this.lines.reduce((sum, line) => {
      const item = this.menu.find((m) => m.id === line.id);
      return sum + item.priceCents * line.quantity;
    }, 0);

    const tax = Math.round(subtotal * this.taxRate);
    const serviceCharge = Math.round((subtotal + tax) * this.serviceChargeRate);

    return { subtotal, tax, serviceCharge, total: subtotal + tax + serviceCharge };
  }
}
