# js-04 · Request ETA

**Difficulty:** ●○○ (1/3)

## What it should do
`requestEtaMinutes(requestType)` returns how many minutes the guest app shows as the
estimated time for a guest request.

| Request type | Minutes |
|---|---|
| `'towels'` | 10 |
| `'pillows'` | 15 |
| `'in-room-dining'` | 35 |
| `'late-checkout'` | 0 (confirmed instantly) |
| anything else | 20 |

## Your task
Read `requestEta.js` and find the bug before running anything. Explain the root cause out loud, fix it, then confirm:

```bash
npm run bug-hunt -- js-04
```
