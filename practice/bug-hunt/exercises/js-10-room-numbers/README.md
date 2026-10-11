# js-10 · Room numbers from a pasted list

**Difficulty:** ●●○ (2/3)

## What it should do
Housekeeping supervisors paste a comma-separated list of rooms to clean first, e.g.
`"1204, 1207,1301"` (spacing is inconsistent because it comes from an email).
`parseRoomNumbers(input)` returns the room numbers as numbers, in the same order.

## Examples
| Input | Output |
|---|---|
| `'1204, 1207,1301'` | `[1204, 1207, 1301]` |
| `'802'` | `[802]` |
| `'1502,1503,1504,1505'` | `[1502, 1503, 1504, 1505]` |

### Also in this file
Empty entries are skipped: `'1204,,1207,'` → `[1204, 1207]`.
`cleaningRoute(roomNumbers)` turns the list into the route shown on the housekeeping tablet:
`[1204, 1207, 1301]` → `'1204 → 1207 → 1301'`.

## Your task
Read `roomNumbers.js` and find the bug before running anything. Explain the root cause out loud, fix it, then confirm:

```bash
npm run bug-hunt -- js-10
```
