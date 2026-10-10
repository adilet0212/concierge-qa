# js-19 · Checkout reminders

**Difficulty:** ●●○ (2/3)

## What it should do
Every morning a job sends a checkout reminder email to each guest leaving today.
`sendCheckoutReminders(guests, sendEmail)` must:
- send one email per guest (`sendEmail(email, message)` returns a promise),
- resolve only after every email has been sent,
- resolve to `{ sent: <number of emails sent> }` so the job can log it.

## Examples
| Guests | Result |
|---|---|
| 3 guests | resolves to `{ sent: 3 }`, and all 3 emails have gone out by then |
| no guests | resolves to `{ sent: 0 }` |

## Your task
Read `checkoutReminders.js` and find the bug before running anything. Explain the root cause out loud, fix it, then confirm:

```bash
npm run bug-hunt -- js-19
```
