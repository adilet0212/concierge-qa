# r2-a · Amenity sentence

**Difficulty:** ●○○ (1/3) · suggested time: 5 minutes

## What it should do
Property cards describe the amenities in plain English: items separated by commas, with
"and" before the last one.

## Examples
| Input | Output |
|---|---|
| `[]` | `''` |
| `['Pool']` | `'Pool'` |
| `['Pool', 'Spa']` | `'Pool and Spa'` |
| `['Pool', 'Spa', 'Gym']` | `'Pool, Spa and Gym'` |
| `['Pool', 'Spa', 'Gym', 'Kids club']` | `'Pool, Spa, Gym and Kids club'` |

## Your task
```bash
npm run bug-hunt -- r2-a
```
