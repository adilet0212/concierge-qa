const DAYS = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
const MONTHS = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];

// Label on the booking card, e.g. "Sun, 15 Mar 2026".
export function arrivalLabel(isoDate) {
  const [year, month, day] = isoDate.split('-').map(Number);
  // Fixed: the Date constructor's month is 0-based (0 = January), ISO months are 1-based.
  const date = new Date(year, month - 1, day);
  return `${DAYS[date.getDay()]}, ${day} ${MONTHS[date.getMonth()]} ${year}`;
}
