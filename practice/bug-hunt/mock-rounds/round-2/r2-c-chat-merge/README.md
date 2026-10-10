# r2-c · Merging chat messages

**Difficulty:** ●●● (3/3) · suggested time: 8 minutes

## What it should do
The concierge chat screen polls the server every few seconds. Each poll returns the latest
messages, which overlap with what is already on screen (the server sends fresh copies of
recent messages, not the same objects).

`mergeMessages(thread, incoming)` returns the new list to display:
- every message exactly once (messages are identified by `id`),
- sorted by `sentAt` (an ISO timestamp), oldest first,
- without modifying `thread` (it is React state; mutating it breaks re-rendering).

## Example
```js
thread   = [{ id: 'm1', sentAt: '…T10:00:00Z' }, { id: 'm2', sentAt: '…T10:02:00Z' }]
incoming = [{ id: 'm2', sentAt: '…T10:02:00Z' }, { id: 'm3', sentAt: '…T10:01:00Z' }]  // fresh copies
```
Result ids: `['m1', 'm3', 'm2']`, and `thread` still has 2 messages.

## Your task
```bash
npm run bug-hunt -- r2-c
```
