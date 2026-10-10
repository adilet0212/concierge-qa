// "Compare properties" screen: tonight's rate for each property, fetched in parallel.
export async function getTonightsRates(propertyIds, fetchRate) {
  const rates = [];

  await Promise.all(
    propertyIds.map(async (propertyId) => {
      const rate = await fetchRate(propertyId);
      rates.push(rate);
    }),
  );

  return propertyIds.map((propertyId, index) => ({ propertyId, rate: rates[index] }));
}
