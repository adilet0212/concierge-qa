// "Compare properties" screen: tonight's rate for each property, fetched in parallel.
export async function getTonightsRates(propertyIds, fetchRate) {
  // Fixed: pushing inside the callbacks stores rates in the order they FINISH.
  // Promise.all already returns results in the order of the input array.
  const rates = await Promise.all(propertyIds.map((propertyId) => fetchRate(propertyId)));
  return propertyIds.map((propertyId, index) => ({ propertyId, rate: rates[index] }));
}
