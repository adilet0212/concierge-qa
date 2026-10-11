# sim-02 · Stay validator (interview simulation)

**Difficulty:** ●●● (3/3) · this module has **more than one** bug.

## What it should do
The booking form calls `validateStay(form)` before letting the guest continue to payment.
Dates are ISO strings (`YYYY-MM-DD`); `adults` and `children` are numbers.

It returns `{ valid, nights, errors }`. The rules:
| Rule | Error message |
|---|---|
| Check-in cannot be before `today` | `Check-in cannot be in the past.` |
| Check-out must be at least one night after check-in | `Check-out must be after check-in.` |
| At most 30 nights online | `Stays longer than 30 nights must be booked by phone.` |
| At least one adult | `At least one adult is required.` |
| Adults + children must not exceed the room's `maxGuests` (a room for 2 accepts 2) | `This room fits up to <maxGuests> guests.` |

`nightsBetween(checkIn, checkOut)` counts nights, e.g. `2026-06-10` → `2026-06-13` is 3 nights.
(The practice runner pins the machine time zone to `America/Toronto` so results are the same on every machine.)

## Examples
| Form | Result |
|---|---|
| 2026-06-10 → 2026-06-13, 2 adults, room for 2, today 2026-06-01 | `{ valid: true, nights: 3, errors: [] }` |
| 2026-03-07 → 2026-03-09, 1 adult, room for 2, today 2026-03-01 | `{ valid: true, nights: 2, errors: [] }` |
| 2026-06-10 → 2026-06-10 | invalid: `Check-out must be after check-in.` |
| 2 adults + 1 child, room for 2 | invalid: `This room fits up to 2 guests.` |

### Also in this file
`staySummary({ nights, adults, children })` is the line at the top of the payment page:
`{ nights: 3, adults: 2, children: 1 }` → `'3 nights · 2 adults, 1 child'`, and
`{ nights: 1, adults: 1, children: 0 }` → `'1 night · 1 adult'`.

## Your task
Set a 15-minute timer, read `stayValidator.js` top to bottom, and talk through every bug you find. Then confirm:

```bash
npm run bug-hunt -- sim-02
```
