# js-15 · Wake-up calls

**Difficulty:** ●●○ (2/3)

## What it should do
`scheduleWakeUpCalls(roomNumbers, schedule)` registers one wake-up call per room.
`schedule(callback)` is provided by the phone system: it stores the callback and calls it
later, at the requested time. Each callback returns the message the phone reads out.

## Examples
For rooms `[1204, 1507, 802]`, when the phone system later runs the three callbacks, they return:
- `'Good morning! This is your wake-up call for room 1204.'`
- `'Good morning! This is your wake-up call for room 1507.'`
- `'Good morning! This is your wake-up call for room 802.'`

## Your task
Read `wakeUpCalls.js` and find the bug before running anything. Explain the root cause out loud, fix it, then confirm:

```bash
npm run bug-hunt -- js-15
```
