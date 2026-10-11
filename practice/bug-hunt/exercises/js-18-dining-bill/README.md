# js-18 · In-room dining bill

**Difficulty:** ●●○ (2/3)

## What it should do
`calculateBill(items, taxRate)` produces the numbers printed on the in-room dining receipt.
Menu prices are in dollars (e.g. `24.40`).
- `subtotal` = sum of price × quantity
- `tax` = subtotal × taxRate, rounded to the nearest cent
- `total` = subtotal + tax

Every amount must be a clean dollar-and-cents value, because it is printed on the receipt
and sent to the payment terminal. The receipt must add up exactly.

## Examples
| Items | Tax rate | Result |
|---|---|---|
| Club sandwich 24.40 ×1, Fresh juice 6.20 ×1 | 0.13 | `{ subtotal: 30.6, tax: 3.98, total: 34.58 }` |
| Espresso 1.10 ×1, Biscotti 2.20 ×1 | 0.05 | `{ subtotal: 3.3, tax: 0.17, total: 3.47 }` |
| Steak frites 42.00 ×2 | 0.10 | `{ subtotal: 84, tax: 8.4, total: 92.4 }` |

### Also in this file
`deliveryWindow(items)` is printed under the totals: delivery is 10 to 20 minutes after the slowest
dish is ready. A dish without `prepMinutes` takes 15 minutes.

| Preparation times | Output |
|---|---|
| 25 and 5 minutes | `'Delivery in 35-45 minutes'` |
| not given | `'Delivery in 25-35 minutes'` |

## Your task
Read `diningBill.js` and find the bug before running anything. Explain the root cause out loud, fix it, then confirm:

```bash
npm run bug-hunt -- js-18
```
