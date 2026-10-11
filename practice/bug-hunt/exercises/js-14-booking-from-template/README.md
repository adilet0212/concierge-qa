# js-14 · Group bookings from a template

**Difficulty:** ●●○ (2/3)

## What it should do
For weddings and conferences, the group coordinator fills in a template once (property, dates,
extras every room gets) and then creates one booking per guest.
`createRoomBooking(template, guestName, extraRequests)` returns a new booking with:
- every field from the template,
- the guest's name,
- `extras` = the template's extras followed by this guest's own requests.

Creating a booking must not change the template or any other booking.

## Examples
```js
const template = {
  propertyId: 'paris', checkIn: '2026-06-12', checkOut: '2026-06-15',
  extras: ['airport-transfer'],
};
const a = createRoomBooking(template, 'Ines Moreau', ['crib']);
const b = createRoomBooking(template, 'Tom Becker', ['late-checkout']);
```
| Value | Expected |
|---|---|
| `a.extras` | `['airport-transfer', 'crib']` |
| `b.extras` | `['airport-transfer', 'late-checkout']` |
| `template.extras` | `['airport-transfer']` |

### Also in this file
`createGroupBookings(template, guests)` creates one booking per guest. With the template above and
guests `[{ name: 'Ines Moreau', requests: ['crib'] }, { name: 'Tom Becker' }]`, the two bookings'
extras are `['airport-transfer', 'crib']` and `['airport-transfer']`.

## Your task
Read `groupBooking.js` and find the bug before running anything. Explain the root cause out loud, fix it, then confirm:

```bash
npm run bug-hunt -- js-14
```
