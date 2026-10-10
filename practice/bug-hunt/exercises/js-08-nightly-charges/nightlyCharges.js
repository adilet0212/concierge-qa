// Room lines on the guest's folio. Amounts are in cents.
export function buildNightlyCharges(checkIn, nights, nightlyRate) {
  const charges = [];
  const start = new Date(`${checkIn}T00:00:00Z`);

  for (let night = 0; night <= nights; night++) {
    const date = new Date(start);
    date.setUTCDate(start.getUTCDate() + night);
    charges.push({
      date: date.toISOString().slice(0, 10),
      amount: nightlyRate,
    });
  }

  return charges;
}

export function folioTotal(charges) {
  return charges.reduce((sum, charge) => sum + charge.amount, 0);
}
