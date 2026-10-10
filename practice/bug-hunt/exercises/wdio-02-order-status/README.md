# wdio-02 · New order status test

**Difficulty:** ●○○ (1/3) · WebdriverIO · read and explain

## What the test should check
A guest at Aurelle Paris orders a Caesar salad. The order page then shows the status `Received`.

## What the team noticed
The test passes locally, but it adds several seconds to every run, and on a busy CI machine it
failed twice last week with `expected "" to be "Received"`.

## Your task
Read `orderStatus.e2e.js`. Explain both problems (slow and flaky) and rewrite the test so it is
fast and reliable. You can run it against the demo app (`npm run app` in another terminal):

```bash
npm run bug-hunt -- wdio-02
```
