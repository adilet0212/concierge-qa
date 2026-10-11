// Greeting at the top of the guest app's home screen.
export function greeting(guest) {
  const name = guest.profile.preferredName || guest.firstName;
  return `Welcome back, ${name}`;
}

// Badge under the greeting, e.g. "Gold member". Guests outside the loyalty programme get none.
export function loyaltyBadge(guest) {
  if (!guest.loyaltyTier) {
    return '';
  }
  const tier = guest.loyaltyTier;
  return `${tier[0].toUpperCase()}${tier.slice(1)} member`;
}
