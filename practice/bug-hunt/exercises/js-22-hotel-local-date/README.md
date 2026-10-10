# js-22 · Today's date at the hotel

**Difficulty:** ●●● (3/3)

## What it should do
Breakfast vouchers are valid for one calendar day at the hotel. The guest's phone can be in
any time zone (a guest in Toronto checks their Tokyo voucher before flying).
- `hotelLocalDate(now, timeZone)` returns the calendar date at the hotel as `YYYY-MM-DD`.
  `now` is a `Date`; `timeZone` is an IANA name such as `'Asia/Tokyo'`.
- `isBreakfastVoucherValid(voucher, now, timeZone)` is `true` when the voucher's `validOn`
  date is today at the hotel.

The practice runner pins the machine time zone to `America/Toronto`, like a phone in Toronto.

## Examples
| `now` (UTC) | Hotel zone | Hotel date |
|---|---|---|
| `2026-03-14T20:00:00Z` | `Asia/Tokyo` | `2026-03-15` (5:00 am in Tokyo) |
| `2026-03-15T12:00:00Z` | `Asia/Tokyo` | `2026-03-15` (9:00 pm in Tokyo) |
| `2026-07-01T03:00:00Z` | `Pacific/Honolulu` | `2026-06-30` (5:00 pm in Honolulu) |
| `2026-07-01T03:00:00Z` | `Europe/Paris` | `2026-07-01` (5:00 am in Paris) |

## Your task
Read `hotelLocalDate.js` and find the bug before running anything. Explain the root cause out loud, fix it, then confirm:

```bash
npm run bug-hunt -- js-22
```
