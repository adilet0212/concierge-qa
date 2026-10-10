# js-07 · Stay search from the URL

**Difficulty:** ●○○ (1/3)

## What it should do
When a guest shares a search link such as `?adults=2&children=1&nights=3`, the app reads the
query string and pre-fills the search form. Missing values use defaults:
1 adult, 0 children, 1 night. `totalGuests` drives the room filter.

## Examples
| Query string | Output |
|---|---|
| `'?adults=2&children=1&nights=3'` | `{ adults: 2, children: 1, nights: 3, totalGuests: 3 }` |
| `'?adults=2'` | `{ adults: 2, children: 0, nights: 1, totalGuests: 2 }` |
| `''` | `{ adults: 1, children: 0, nights: 1, totalGuests: 1 }` |

## Your task
Read `staySearch.js` and find the bug before running anything. Explain the root cause out loud, fix it, then confirm:

```bash
npm run bug-hunt -- js-07
```
