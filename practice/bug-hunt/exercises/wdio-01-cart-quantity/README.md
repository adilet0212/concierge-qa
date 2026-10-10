# wdio-01 · Cart quantity test

**Difficulty:** ●○○ (1/3) · WebdriverIO · read and explain

## What the test should check
A guest opens the in-room dining menu for Aurelle Toronto, adds one club sandwich, and the cart
shows quantity `1` for that dish.

## What the team noticed
Last sprint someone broke the cart (it showed `0`) and this test stayed green in CI.

## Your task
Read `cartQuantity.e2e.js`. Explain why this test cannot catch a broken cart, and fix it.
You can run it against the demo app (`npm run app` in another terminal):

```bash
npm run bug-hunt -- wdio-01
```

A green run does not prove the test is right. That is the point of this exercise.
