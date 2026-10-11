# js-06 · Arrival date label

**Difficulty:** ●○○ (1/3)

## What it should do
`arrivalLabel(isoDate)` turns a stay date in ISO format (`YYYY-MM-DD`) into the short label
shown on the guest's booking card: day of week, day, month, year.

## Examples
| Input | Output |
|---|---|
| `'2026-03-15'` | `'Sun, 15 Mar 2026'` |
| `'2026-12-31'` | `'Thu, 31 Dec 2026'` |
| `'2026-01-31'` | `'Sat, 31 Jan 2026'` |

### Also in this file
`nightsLabel(nights)` is shown next to the date: `1` → `'1 night'`, `3` → `'3 nights'`.

## Your task
Read `arrivalLabel.js` and find the bug before running anything. Explain the root cause out loud, fix it, then confirm:

```bash
npm run bug-hunt -- js-06
```
