# js-21 · Tonight's rates across properties

**Difficulty:** ●●● (3/3)

## What it should do
The "Compare properties" screen shows tonight's rate for several properties side by side.
`getTonightsRates(propertyIds, fetchRate)` fetches all rates in parallel (one slow property
must not delay the others) and returns them in the same order as `propertyIds`:

```js
[{ propertyId: 'toronto', rate: 450 }, { propertyId: 'paris', rate: 380 }, ...]
```

`fetchRate(propertyId)` returns a promise of a number. Each property's pricing service
answers at a different speed.

## Examples
| propertyIds | Rates from the pricing service | Result |
|---|---|---|
| `['toronto', 'paris', 'tokyo']` | toronto 450 (slow), paris 380 (fast), tokyo 52000 (medium) | `[{ toronto, 450 }, { paris, 380 }, { tokyo, 52000 }]` |
| `[]` | | `[]` |

## Your task
Read `rateComparison.js` and find the bug before running anything. Explain the root cause out loud, fix it, then confirm:

```bash
npm run bug-hunt -- js-21
```
