// Greeting at the top of the guest app's home screen.
export function greeting(guest) {
  const name = guest.profile.preferredName || guest.firstName;
  return `Welcome back, ${name}`;
}
