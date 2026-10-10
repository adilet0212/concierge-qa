const DAYS = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
const MONTHS = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];

// Label on the booking card, e.g. "Sun, 15 Mar 2026".
export function arrivalLabel(isoDate) {
  const [year, month, day] = isoDate.split('-').map(Number);
  const date = new Date(year, month, day);
  return `${DAYS[date.getDay()]}, ${day} ${MONTHS[date.getMonth()]} ${year}`;
}
