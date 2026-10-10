// Greeting at the top of the guest app's home screen.
export function greeting(guest) {
  // Fixed: profile can be missing, so use optional chaining before reading from it.
  const name = guest.profile?.preferredName || guest.firstName;
  return `Welcome back, ${name}`;
}
