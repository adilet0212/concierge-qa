# js-17 · Room status filter

**Difficulty:** ●●○ (2/3)

## What it should do
The housekeeping dashboard has a status dropdown. Its value is one of the numeric codes below,
or the empty string `''` when "All rooms" is selected.
`filterRooms(rooms, statusFilter)` returns the rooms to show.

| Code | Meaning |
|---|---|
| `0` | vacant |
| `1` | occupied |
| `2` | being cleaned |

## Examples
```js
const rooms = [
  { number: 801, status: 0 },
  { number: 802, status: 1 },
  { number: 803, status: 2 },
  { number: 804, status: 0 },
];
```
| Filter | Rooms shown |
|---|---|
| `''` | 801, 802, 803, 804 |
| `0` | 801, 804 |
| `1` | 802 |

### Also in this file
`filterOptions()` builds the drop-down's options: `{ value: '', label: 'All rooms' }` first, then
`{ value: 0, label: 'Vacant' }`, `{ value: 1, label: 'Occupied' }` and `{ value: 2, label: 'Being cleaned' }`.

## Your task
Read `roomFilter.js` and find the bug before running anything. Explain the root cause out loud, fix it, then confirm:

```bash
npm run bug-hunt -- js-17
```
