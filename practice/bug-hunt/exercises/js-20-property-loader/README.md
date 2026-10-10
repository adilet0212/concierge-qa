# js-20 · Property details loader

**Difficulty:** ●●○ (2/3)

## What it should do
The property details screen needs the property and its rooms before it renders.
`loadPropertyWithRooms(fetchJson, propertyId)` returns a promise that resolves to the property
object with a `rooms` array attached.

`fetchJson(url)` returns a promise of the parsed JSON body and rejects on HTTP errors.
If either request fails, the returned promise must reject with that error, so the screen
can show "Something went wrong, please try again".

## Examples
| API responses | Result |
|---|---|
| property `{ id: 'tokyo', name: 'Aurelle Tokyo' }`, rooms `[{ id: 'deluxe-king' }]` | resolves to `{ id: 'tokyo', name: 'Aurelle Tokyo', rooms: [{ id: 'deluxe-king' }] }` |
| property OK, rooms request fails with `Error('503 Service Unavailable')` | rejects with that error |

## Your task
Read `propertyLoader.js` and find the bug before running anything. Explain the root cause out loud, fix it, then confirm:

```bash
npm run bug-hunt -- js-20
```
