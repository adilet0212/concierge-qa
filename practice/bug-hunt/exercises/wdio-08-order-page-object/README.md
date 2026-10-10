# wdio-08 · Order tracking page object

**Difficulty:** ●●● (3/3) · WebdriverIO · runnable · **more than one** bug

## What the test should check
A guest has an in-room dining order (created through the API). When the kitchen marks it as
"preparing" (also through the API, like a staff tablet would), the guest's order page updates
to show `Preparing` within a few seconds (the page polls the server).

## Files
- `order.page.js`: the page object for the order tracking page.
- `orderTracking.e2e.js`: the test.

## What the team noticed
The test fails. A first developer "fixed" one thing, and it still failed, this time after
waiting the full timeout.

## Your task
Read both files. Find every bug, explain each root cause and fix them.
Start the demo app in another terminal (`npm run app`), then:

```bash
npm run bug-hunt -- wdio-08
```
