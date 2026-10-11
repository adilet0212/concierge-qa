# wdio-03 · Sign-in code step test

**Difficulty:** ●●○ (2/3) · WebdriverIO · runnable

## What the test should check
On the sign-in page, a guest enters their email and asks for a code. The page then shows the
field where they type the 6-digit one-time code.

## What the team noticed
The test fails, but the feature works perfectly when you try it by hand. The suite runs in
English, French and Japanese, on desktop and phone sizes.

## Your task
Read `signInCode.e2e.js`. Find why it fails and fix it. Then review the rest of the test the way
you would review a teammate's pull request: what else would you change, and why?
Start the demo app in another terminal (`npm run app`), then:

```bash
npm run bug-hunt -- wdio-03
```

Tip: open http://localhost:4300/sign-in and use the browser DevTools to inspect the page.
