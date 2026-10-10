# r2-b · Promo code check

**Difficulty:** ●●○ (2/3) · suggested time: 7 minutes

## What it should do
A promo code is four letters followed by two digits, e.g. `SUMR26`. Guests may type it in
lowercase or with spaces around it; that is accepted.
- `isValidPromo(code)` checks one code. It can be called any number of times.
- `validPromos(codes)` keeps only the valid codes from a list (used for the group-booking import).

## Examples
| Call | Output |
|---|---|
| `isValidPromo('SUMR26')` | `true` (every time it is called) |
| `isValidPromo(' golf15 ')` | `true` |
| `isValidPromo('SPRING')` | `false` |
| `validPromos(['SUMR26', 'GOLF15', 'bad', 'SPAS10'])` | `['SUMR26', 'GOLF15', 'SPAS10']` |

## Your task
```bash
npm run bug-hunt -- r2-b
```
