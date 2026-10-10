# wdio-07 · Order history in a parallel suite

**Difficulty:** ●●● (3/3) · WebdriverIO · read and explain

## What the test should check
After a guest places one in-room dining order, their order history (from the API) contains
exactly one order.

## Context
This file is one of about ten spec files in the suite. The suite runs with `maxInstances: 5`,
so five spec files run at the same time against the same server. Other files also sign in,
place orders and make bookings.

## What the team noticed
- On its own, the file always passes.
- In the full parallel run it fails about one run in five, sometimes with `expected length 1, got 2`.
- On the same runs, other, unrelated spec files fail with `401 Unauthorized` or "booking not found".

## Your task
Read `orderHistory.e2e.js`. Explain both root causes and fix them so the file is safe to run in
parallel with anything. You can run it against the demo app (`npm run app` in another terminal):

```bash
npm run bug-hunt -- wdio-07
```
