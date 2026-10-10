# wdio-05 · Booking confirmation heading

**Difficulty:** ●○○ (1/3) · WebdriverIO · runnable

## What the test should check
After a booking is made, its confirmation page shows the heading `Your stay is confirmed`.
(The test creates the booking through the API to save time, then opens the page.)

## What the team noticed
The test fails, but a screenshot taken at the moment of failure clearly shows the heading
`Your stay is confirmed` on the page.

## Your task
Read `confirmationHeading.e2e.js`. Explain the root cause and fix the assertion.
Start the demo app in another terminal (`npm run app`), then:

```bash
npm run bug-hunt -- wdio-05
```
