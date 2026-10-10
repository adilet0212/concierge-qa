# r1-a · Late checkout fee

**Difficulty:** ●○○ (1/3) · suggested time: 5 minutes

## What it should do
`lateCheckoutFee(guest, checkoutHour, roomNeededToday)` returns the fee in dollars.
- Checkout at or before 12 (noon) is always free.
- A later checkout is free for gold or platinum members.
- A later checkout is also free when the room is not needed again today.
- Otherwise: until 14:00 costs $50; after 14:00 costs $100.

## Examples
| Guest tier | Hour | Room needed today? | Fee |
|---|---|---|---|
| silver | 11 | yes | 0 |
| silver | 13 | yes | 50 |
| silver | 16 | yes | 100 |
| silver | 16 | no | 0 |
| gold | 13 | yes | 0 |
| platinum | 15 | yes | 0 |

## Your task
```bash
npm run bug-hunt -- r1-a
```
