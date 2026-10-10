# js-12 · Booking reference check

**Difficulty:** ●●○ (2/3)

## What it should do
Guests type or paste their booking reference to find a stay. A valid reference is:
the prefix `AUR`, a dash, then exactly six characters, each an uppercase letter or a digit
(e.g. `AUR-4F7K2Q`). Guests often paste with spaces around it or type in lowercase, and that
is accepted. Anything else is rejected before calling the API.

## Examples
| Input | Valid? |
|---|---|
| `'AUR-4F7K2Q'` | yes |
| `'  aur-4f7k2q '` | yes |
| `'AUR-4F7K2Q9'` (seven characters) | no |
| `'XAUR-4F7K2Q'` | no |
| `'AUR-4F7K'` | no |

## Your task
Read `bookingReference.js` and find the bug before running anything. Explain the root cause out loud, fix it, then confirm:

```bash
npm run bug-hunt -- js-12
```
