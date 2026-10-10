# js-13 · Top-rated rooms

**Difficulty:** ●●○ (2/3)

## What it should do
`topRatedRooms(rooms, count)` returns the `count` best-rated room types (highest rating first)
for the "Guest favourites" carousel. `count` defaults to 3.

The same `rooms` array is also rendered further down the page as the full room list,
in the order the hotel chose (the original order).

## Examples
```js
const rooms = [
  { name: 'Deluxe King', rating: 4.6 },
  { name: 'Garden Suite', rating: 4.9 },
  { name: 'Classic Twin', rating: 4.2 },
  { name: 'Penthouse', rating: 4.8 },
];
```
| Call | Output |
|---|---|
| `topRatedRooms(rooms, 2)` | Garden Suite, Penthouse |
| `topRatedRooms(rooms)` | Garden Suite, Penthouse, Deluxe King |
| `rooms` afterwards | still Deluxe King, Garden Suite, Classic Twin, Penthouse |

## Your task
Read `topRatedRooms.js` and find the bug before running anything. Explain the root cause out loud, fix it, then confirm:

```bash
npm run bug-hunt -- js-13
```
