# wdio-04 · Mobile menu button on desktop

**Difficulty:** ●●○ (2/3) · WebdriverIO · runnable

## What the test should check
The Aurelle header shows a "menu" (hamburger) button on phones only. On a desktop-sized window
(the practice config uses 1280×900) the guest must not see that button.

## What the team noticed
The test fails on desktop, yet when you look at the page in a desktop browser the button is
clearly not on the screen.

## Your task
Read `mobileMenu.e2e.js`. Explain the root cause and fix the assertion.
Start the demo app in another terminal (`npm run app`), then:

```bash
npm run bug-hunt -- wdio-04
```
