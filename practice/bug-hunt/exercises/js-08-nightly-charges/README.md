# js-08 · Nightly charges

**Difficulty:** ●○○ (1/3)

## What it should do
`buildNightlyCharges(checkIn, nights, nightlyRate)` creates the room lines on the guest's folio
(bill): one charge per night of the stay, each dated, starting on the check-in date.
Amounts are in cents. `folioTotal(charges)` adds the charges up.

## Examples
| Call | Expected |
|---|---|
| `buildNightlyCharges('2026-03-10', 3, 25000)` | charges dated `2026-03-10`, `2026-03-11`, `2026-03-12`, each `25000` |
| `folioTotal(buildNightlyCharges('2026-03-10', 2, 25000))` | `50000` |
| `buildNightlyCharges('2026-01-30', 3, 100)` | dated `2026-01-30`, `2026-01-31`, `2026-02-01` |

## Your task
Read `nightlyCharges.js` and find the bug before running anything. Explain the root cause out loud, fix it, then confirm:

```bash
npm run bug-hunt -- js-08
```
