# wdio-06 · Booking journey

**Difficulty:** ●●○ (2/3) · WebdriverIO · read and explain

## What the tests should check
1. A guest can sign in.
2. They can open Aurelle Tokyo.
3. They can start a booking there.

## What the team noticed
- When "opens Aurelle Tokyo" fails once, every test after it fails too, so the report shows
  three failures for one problem.
- Running only the last test (`--mochaOpts.grep "starts a booking"`) always fails.
- The retry setting (`retries: 1`) never rescues these tests.

## Your task
Read `bookingJourney.e2e.js`. Explain the design problem behind all three symptoms and rewrite
the tests so each one can run on its own, in any order. You can run it against the demo app
(`npm run app` in another terminal):

```bash
npm run bug-hunt -- wdio-06
```
