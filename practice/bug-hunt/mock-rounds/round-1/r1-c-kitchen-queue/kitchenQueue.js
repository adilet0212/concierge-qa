// Kitchen display: open orders from every outlet, oldest first.
export async function openOrdersOldestFirst(outlets, fetchOrders) {
  const results = outlets.map(async (outlet) => fetchOrders(outlet));
  const orders = results.flat();
  return orders.sort((a, b) => a.placedAt > b.placedAt);
}
