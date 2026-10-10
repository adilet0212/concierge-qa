# r3-a · Digital room key expiry

**Difficulty:** ●○○ (1/3) · suggested time: 5 minutes

## What it should do
Digital room keys (in the guest app) stop working at 12:00 noon on the checkout date,
in the device's local time.
- `keyExpiry(checkOutDate)` returns that moment as a `Date`. `checkOutDate` is `YYYY-MM-DD`.
- `isKeyValid(checkOutDate, now)` is `true` before that moment and `false` from then on.

## Examples (checkout `2026-07-04`)
| now | Valid? |
|---|---|
| 3 July, 22:00 | yes |
| 4 July, 11:59 | yes |
| 4 July, 12:00 | no |
| 5 July, 09:00 | no |

## Your task
```bash
npm run bug-hunt -- r3-a
```
