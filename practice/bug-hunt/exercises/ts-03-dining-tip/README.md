# ts-03 · Suggested tip (TypeScript)

**Difficulty:** ●○○ (1/3)

## What it should do
At the end of an in-room dining order the guest can choose a tip percentage, or skip the step.
`tipAmount(order)` returns the tip in cents, rounded to the nearest cent.
- If the guest skipped the step (`tipPercent` is missing), suggest the default of 15%.
- If the guest chose a percentage, use it. That includes choosing 0%.

## Examples
| Order | Tip (cents) |
|---|---|
| `{ subtotal: 4000 }` | `600` (15% default) |
| `{ subtotal: 4000, tipPercent: 20 }` | `800` |
| `{ subtotal: 4000, tipPercent: 0 }` | `0` |
| `{ subtotal: 1999, tipPercent: 18 }` | `360` |

## Your task
Read `tip.ts` and find the bug before running anything. Explain the root cause out loud, fix it, then confirm:

```bash
npm run bug-hunt -- ts-03
```
