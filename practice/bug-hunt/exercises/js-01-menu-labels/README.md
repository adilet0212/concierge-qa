# js-01 · Menu labels

**Difficulty:** ●○○ (1/3)

## What it should do
`menuLabels(dishes)` builds the text shown for each dish on the in-room dining menu:
the dish name, a middle dot, and the price in dollars with two decimals.

## Examples
| Input | Output |
|---|---|
| `[{ name: 'Club sandwich', priceCents: 2400 }]` | `['Club sandwich · $24.00']` |
| `[{ name: 'Fresh orange juice', priceCents: 650 }]` | `['Fresh orange juice · $6.50']` |
| `[]` | `[]` |

## Your task
Read `menuLabels.js` and find the bug before running anything. Explain the root cause out loud, fix it, then confirm:

```bash
npm run bug-hunt -- js-01
```
