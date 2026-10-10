# js-03 · Find an available room

**Difficulty:** ●○○ (1/3)

## What it should do
`findAvailableRoom(rooms, roomType)` returns the first room of the requested type that is available.
If no room matches, it returns `null`.

## Examples
Rooms:
```js
[
  { number: 1201, type: 'suite', available: false },
  { number: 1202, type: 'king', available: true },
  { number: 1203, type: 'suite', available: true },
]
```

| Type | Output |
|---|---|
| `'suite'` | room 1203 |
| `'twin'` | `null` |
| `'king'` on an empty list | `null` |

## Your task
Read `findAvailableRoom.js` and find the bug before running anything. Explain the root cause out loud, fix it, then confirm:

```bash
npm run bug-hunt -- js-03
```
