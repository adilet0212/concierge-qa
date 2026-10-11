# js-02 · Cheapest rate

**Difficulty:** ●○○ (1/3)

## What it should do
`cheapestRate(offers)` returns the lowest nightly rate (in dollars) from a list of room offers.
It is used for the "from $___ per night" text on each property card.

## Examples
| Nightly rates in the offers | Output |
|---|---|
| `450, 95, 1200, 300` | `95` |
| `780, 1450` | `780` |
| `620` | `620` |

### Sold-out offers
Offers that are sold out (`available: false`) are ignored. If every offer is sold out, it returns
`null`, and the card shows "Sold out" instead of a price.

| Offers | Output |
|---|---|
| `95` (sold out), `450`, `300` | `300` |
| `95` (sold out) | `null` |

## Your task
Read `cheapestRate.js` and find the bug before running anything. Explain the root cause out loud, fix it, then confirm:

```bash
npm run bug-hunt -- js-02
```
