# js-16 · Concierge request queue

**Difficulty:** ●●○ (2/3)

## What it should do
`RequestQueue` keeps the concierge desk's guest requests in arrival order.
- `add(request)` appends one request and stamps it with `receivedAt` (1 for the first, 2 for the second, ...).
- `addAll(requests)` adds several at once (used when the app reconnects after being offline).
- `next()` removes and returns the oldest request.

## Examples
```js
const queue = new RequestQueue();
queue.addAll([{ room: 1204, text: 'Extra pillows' }, { room: 802, text: 'Taxi at 7am' }]);
queue.next(); // { room: 1204, text: 'Extra pillows', receivedAt: 1 }
queue.next(); // { room: 802, text: 'Taxi at 7am', receivedAt: 2 }
```

## Your task
Read `requestQueue.js` and find the bug before running anything. Explain the root cause out loud, fix it, then confirm:

```bash
npm run bug-hunt -- js-16
```
