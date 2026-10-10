# ts-01 · Room availability (TypeScript)

**Difficulty:** ●●○ (2/3)

## What it should do
Before confirming a booking, the app checks that the room is free for the requested dates.
Dates are ISO strings (`YYYY-MM-DD`).
- `checkIn` is the day the guest arrives; `checkOut` is the day they leave (they do not sleep there that night).
- Two stays clash if they share at least one night.
- Back-to-back stays are fine: one guest checks out in the morning and the next checks in that afternoon.

`staysOverlap(a, b)` says whether two stays clash. `isRoomFree(roomNumber, requested, reservations)`
is `true` when no reservation for that room clashes with the requested stay.

## Examples
Existing reservation for room 1204: `2026-05-10` → `2026-05-13` (nights of the 10th, 11th, 12th).

| Requested stay | Room free? |
|---|---|
| `2026-05-01` → `2026-05-04` | yes (well before) |
| `2026-05-11` → `2026-05-12` | no (inside it) |
| `2026-05-13` → `2026-05-15` | yes (back-to-back) |
| `2026-05-08` → `2026-05-10` | yes (back-to-back) |
| `2026-05-12` → `2026-05-16` | no (shares the 12th) |
| room 1205, any dates | yes (different room) |

## Your task
Read `availability.ts` and find the bug before running anything. Explain the root cause out loud, fix it, then confirm:

```bash
npm run bug-hunt -- ts-01
```
