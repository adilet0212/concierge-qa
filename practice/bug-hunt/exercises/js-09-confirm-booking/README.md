# js-09 · Confirm a booking

**Difficulty:** ●○○ (1/3)

## What it should do
`confirmBooking(api, bookingId)` confirms a pending booking and returns its reference
for the confirmation screen. Any other status (for example `cancelled`) is an error, and the
error message must include the real status so support can see what happened.

`api` is the app's API client. All of its methods return promises:
- `api.getBooking(id)` resolves to `{ id, status, reference }`
- `api.updateStatus(id, status)` resolves when the change is saved

## Examples
| Booking returned by the API | Result |
|---|---|
| `{ id: 7, status: 'pending', reference: 'AUR-4F7K2Q' }` | resolves to `'AUR-4F7K2Q'`, status saved as `confirmed` |
| `{ id: 8, status: 'cancelled', reference: 'AUR-9Z1X0B' }` | rejects with `Booking 8 cannot be confirmed (status: cancelled)` |

## Your task
Read `confirmBooking.js` and find the bug before running anything. Explain the root cause out loud, fix it, then confirm:

```bash
npm run bug-hunt -- js-09
```
