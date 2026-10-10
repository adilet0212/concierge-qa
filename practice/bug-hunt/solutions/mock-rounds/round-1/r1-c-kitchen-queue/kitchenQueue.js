// Kitchen display: open orders from every outlet, oldest first.
export async function openOrdersOldestFirst(outlets, fetchOrders) {
  // Fixed (bug 1): map with an async callback gives an array of PROMISES.
  // Await them all (in parallel) before using the results.
  const results = await Promise.all(outlets.map((outlet) => fetchOrders(outlet)));
  const orders = results.flat();

  // Fixed (bug 2): a sort comparator must return a negative, zero or positive NUMBER.
  // `a > b` returns true/false, which never tells sort "a comes first".
  return orders.sort((a, b) => Date.parse(a.placedAt) - Date.parse(b.placedAt));
}
