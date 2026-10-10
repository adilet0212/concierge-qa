# js-05 · Guest greeting

**Difficulty:** ●○○ (1/3)

## What it should do
`greeting(guest)` builds the greeting at the top of the guest app. If the guest set a
preferred name in their profile, use it; otherwise use their first name.

## Examples
| Guest | Output |
|---|---|
| `{ firstName: 'Amelia', profile: { preferredName: 'Mia' } }` | `'Welcome back, Mia'` |
| `{ firstName: 'Liam', profile: {} }` | `'Welcome back, Liam'` |
| `{ firstName: 'Noor' }` (created at the front desk) | `'Welcome back, Noor'` |

## Your task
Read `greeting.js` and find the bug before running anything. Explain the root cause out loud, fix it, then confirm:

```bash
npm run bug-hunt -- js-05
```
