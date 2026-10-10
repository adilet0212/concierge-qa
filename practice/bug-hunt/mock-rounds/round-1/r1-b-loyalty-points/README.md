# r1-b · Loyalty points for a stay

**Difficulty:** ●●○ (2/3) · suggested time: 7 minutes

## What it should do
`pointsForStay(stay)` returns the loyalty points a guest earns for a completed stay.
- 10 points per whole dollar of room charges (cents are ignored).
- A bonus of 500 points for stays of 3 nights or more.

`stay.roomCharges` comes from the billing system as a formatted string, e.g. `"1,250.75"`.

## Examples
| roomCharges | nights | Points |
|---|---|---|
| `'480.00'` | 1 | 4800 |
| `'1,250.75'` | 3 | 13000 |
| `'2,000.00'` | 5 | 20500 |

## Your task
```bash
npm run bug-hunt -- r1-b
```
