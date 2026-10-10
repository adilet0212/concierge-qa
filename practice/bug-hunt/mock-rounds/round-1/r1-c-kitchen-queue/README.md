# r1-c · Kitchen display queue

**Difficulty:** ●●● (3/3) · suggested time: 8 minutes

## What it should do
The kitchen display shows every open order from every outlet (in-room dining, pool bar, ...),
oldest first, so the chefs cook in the right order.

`openOrdersOldestFirst(outlets, fetchOrders)`:
- `fetchOrders(outlet)` returns a promise of `[{ id, outlet, placedAt }]`; `placedAt` is an ISO timestamp.
- Fetch all outlets, combine the orders into one list, and sort it by `placedAt` (oldest first).

## Example
| Outlet | Orders |
|---|---|
| in-room-dining | `IRD-2` placed 10:05, `IRD-1` placed 10:01 |
| pool-bar | `PB-1` placed 10:03 |

Result (ids): `['IRD-1', 'PB-1', 'IRD-2']`

## Your task
```bash
npm run bug-hunt -- r1-c
```
