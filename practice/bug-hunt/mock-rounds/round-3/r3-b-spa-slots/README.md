# r3-b · Spa time slots

**Difficulty:** ●●○ (2/3) · suggested time: 7 minutes

## What it should do
`spaSlots({ open, close, durationMinutes, booked })` lists the treatment start times for one day
(`HH:MM`), starting at opening time, one every `durationMinutes`.
- A treatment must end by closing time.
- Start times already in `booked` are left out.

## Examples
| open | close | duration | booked | Slots |
|---|---|---|---|---|
| 09:00 | 13:00 | 60 | — | `09:00, 10:00, 11:00, 12:00` |
| 09:00 | 13:00 | 90 | — | `09:00, 10:30` |
| 09:00 | 13:00 | 90 | `['10:30']` | `09:00` |
| 14:30 | 17:00 | 50 | — | `14:30, 15:20, 16:10` |

## Your task
```bash
npm run bug-hunt -- r3-b
```
