# Learn this project: a study guide

This guide is for explaining every part of this repo with confidence: how WebdriverIO and Appium
work, why each design choice was made, and how to answer likely questions about it. Examples
come from the code in this repo, so open the files as you read.

**Contents**
1. [A 90-minute study path](#1-a-90-minute-study-path)
2. [How WebdriverIO works](#2-how-webdriverio-works)
3. [How Appium works](#3-how-appium-works)
4. [Folder walkthrough and design choices](#4-folder-walkthrough-and-design-choices)
5. [A 2-minute demo script](#5-a-2-minute-demo-script)
6. [25 interview questions with short answers](#6-25-interview-questions-with-short-answers)
7. [What I would add next](#7-what-i-would-add-next)

---

## 1. A 90-minute study path

Read in this order. Each step builds on the one before.

| Time | Read | What to understand |
|---|---|---|
| 10 min | [README](../README.md), then run `npm run app` and `HEADED=true npm run test:smoke` (PowerShell: `$env:HEADED='true'; npm run test:smoke`) | What the app does; what a test run looks like |
| 10 min | [`tests/web/wdio.conf.ts`](../tests/web/wdio.conf.ts) | The runner's settings: specs, capabilities, timeouts, retries, reporters, hooks |
| 10 min | [`pageobjects/BasePage.ts`](../tests/web/pageobjects/BasePage.ts), [`SignInPage.ts`](../tests/web/pageobjects/SignInPage.ts), [`BookingPage.ts`](../tests/web/pageobjects/BookingPage.ts) | Page objects: selectors live here, specs never see them |
| 15 min | [`specs/sign-in.spec.ts`](../tests/web/specs/sign-in.spec.ts), [`specs/booking.spec.ts`](../tests/web/specs/booking.spec.ts), [`support/api-client.ts`](../tests/web/support/api-client.ts), [`support/session.ts`](../tests/web/support/session.ts) | How a test reads; data created through the API; signed-in state set without the UI |
| 10 min | [`test-data/properties.json`](../test-data/properties.json), [`support/expected.ts`](../tests/web/support/expected.ts), [`specs/property-matrix.spec.ts`](../tests/web/specs/property-matrix.spec.ts) | Data-driven tests: one JSON line = new test cases |
| 10 min | [`app/shared/seeded-bugs.ts`](../app/shared/seeded-bugs.ts), `git grep "SEEDED BUG"`, [`scripts/seeded-bug-report.ts`](../scripts/seeded-bug-report.ts), [`docs/BUG_REPORTS.md`](BUG_REPORTS.md) | How we prove the suite catches real regressions |
| 15 min | [`tests/mobile/wdio.android.conf.ts`](../tests/mobile/wdio.android.conf.ts), [`screens/BaseScreen.ts`](../tests/mobile/screens/BaseScreen.ts), [`screens/NativeAlert.ts`](../tests/mobile/screens/NativeAlert.ts), [`screens/FormsScreen.ts`](../tests/mobile/screens/FormsScreen.ts), [`specs/login.spec.ts`](../tests/mobile/specs/login.spec.ts), [`specs/swipe.spec.ts`](../tests/mobile/specs/swipe.spec.ts) | Appium capabilities, accessibility ids, a native alert, a swipe |
| 10 min | [`.github/workflows/ci.yml`](../.github/workflows/ci.yml), [`android.yml`](../.github/workflows/android.yml), [`support/results-recorder.ts`](../tests/web/support/results-recorder.ts), [`scripts/summarize-results.ts`](../scripts/summarize-results.ts) | The pipeline, the job summaries and how FLAKY tests are detected |

Then open the [latest CI run](https://github.com/adilet0212/concierge-qa/actions/workflows/ci.yml)
and the [Allure reports](https://adilet0212.github.io/concierge-qa/) and match what you see to the code.

---

## 2. How WebdriverIO works

**WebdriverIO (WDIO)** is a Node.js framework for automating browsers and mobile apps. Tests call
one API (`$`, `click`, `expect`...), and WDIO turns those calls into **WebDriver** commands, the W3C
standard protocol that browsers and Appium understand. For Chrome and Firefox it talks to
`chromedriver` and `geckodriver`, which WDIO v9 downloads for you; v9 also turns on
**WebDriver BiDi** (a newer, two-way version of the protocol) by default for browsers.
For mobile, it sends the same commands to an Appium server instead.

```
spec file ─► WDIO runner (Mocha inside) ─► WebDriver over HTTP ─► chromedriver/geckodriver ─► browser
                                                              └─► Appium server ─► phone
```

### The runner and the config file
`npm run test:smoke` runs `wdio run tests/web/wdio.conf.ts --mochaOpts.grep @smoke`. The **runner**
(`@wdio/cli`) reads the config, starts worker processes, and each worker opens one browser session
for one spec file and runs Mocha in it. The important settings in
[`wdio.conf.ts`](../tests/web/wdio.conf.ts):

| Setting | Our value | Why |
|---|---|---|
| `specs` | `tests/web/specs/*.spec.ts` | Which files are tests |
| `maxInstances` | 5 (4 in CI) | Spec files run in parallel, one browser each. Safe because tests don't share data |
| `capabilities` | Chrome or Firefox (env `BROWSER`) | Which browser, and its options (headless, window size) |
| `baseUrl` | `http://localhost:4300` | So tests can write `browser.url('/sign-in')` |
| `waitforTimeout` | 10 s (20 s for Android) | How long auto-waits and `expect` matchers keep retrying |
| `framework` / `mochaOpts` | Mocha, `retries: 1`, 60 s per test | `describe`/`it` syntax; one retry, reported as FLAKY |
| `reporters` | `spec` and `allure` | Console output, and an HTML report with screenshots |
| hooks | `onPrepare`, `afterTest` | Setup once; evidence and results after every test |

### Capabilities
A capability object tells the driver what you want. Vendor-specific options have a prefix:
`goog:chromeOptions` (Chrome), `moz:firefoxOptions` (Firefox), `appium:` (Appium). In
[`wdio.mobile-web.conf.ts`](../tests/web/wdio.mobile-web.conf.ts), `mobileEmulation` turns Chrome
into an iPhone-size or Pixel-size phone, and our own `aurelle:profile` capability just labels the
reports (any `vendor:name` key is allowed and ignored by the driver).

### Services
Services are plugins that manage infrastructure around the tests. The Android config uses
`@wdio/appium-service`, which starts the Appium server before the tests and stops it afterwards.
The web suites need no service: WDIO manages the browser drivers itself.

### Selectors: `$` and `$$`
- `$(selector)` finds the **first** match, `$$(selector)` finds **all** matches.
- They are **lazy**: `$('[data-testid="book-button"]')` doesn't search yet. The search happens when
  you call a command (`click`) or an `expect` matcher. That's why a page object can expose
  `get bookButton()` before the page is even open.
- Selector types used here: CSS `[data-testid="..."]` (web), `~id` for accessibility id,
  `id=android:id/message` for an Android resource id, and `android=new UiSelector().text("...")`.
- **Rule: selectors live only in page objects** (`tests/web/pageobjects/`, `tests/mobile/screens/`).

### Auto-waiting (why there are no sleeps)
Web pages and apps change over time: data loads, buttons appear, status updates arrive. WDIO
handles this in three ways, and this repo uses all three:
1. **Element commands wait for the element to exist** before acting (up to `waitforTimeout`).
   `click()` on a button that appears 300 ms later just works.
2. **`expect` matchers on elements retry** until they pass or time out:
   ```ts
   // dining.spec.ts: the order page polls the server every 1.5 s, so the text changes a moment later.
   await expect(OrderPage.status).toHaveText('Preparing');
   ```
3. **Explicit waits** when you need a condition before continuing:
   ```ts
   // SignInPage.ts: the code field only appears after the server accepted the email.
   await this.codeInput.waitForDisplayed();
   ```
   and `browser.waitUntil(() => ...)` for anything custom (see `webview.spec.ts`).

`browser.pause(3000)` is banned (an ESLint error from `eslint-plugin-wdio`): a fixed sleep is
either too short (flaky on a slow CI machine) or too long (slow on every run).

### `expect-webdriverio` matchers
WDIO's `expect` adds matchers for elements and the browser: `toHaveText`, `toHaveAttribute`,
`toHaveValue`, `toBeDisplayed`, `toBeDisabled`, `toBeEnabled`, `toBeExisting`,
`toBeElementsArrayOfSize`, `toHaveUrl`. They **retry**. Jest-style matchers on plain values
(`toBe`, `toEqual`, `toHaveLength`) check **once**:
```ts
await expect(ConfirmationPage.title).toHaveText('Your stay is confirmed'); // retries up to 10 s
expect(await rawTranslationKeys(SignInPage)).toEqual([]);                 // checks once, right now
```
So before a one-time check, wait for the page first (the localization tests assert the title
with `toHaveText`, which waits, and only then scan the text).

Money is checked through a `data-amount` attribute holding the exact amount in minor units
(cents, or yen), not through formatted text, because "€1,234.50" looks different in every
language and browser:
```ts
await expect(BookingPage.price('total')).toHaveAttribute('data-amount', String(expected.total));
```

### async/await
Every WDIO command returns a Promise, so every command and every element matcher needs `await`.
A forgotten `await` lets the test race ahead: the assertion may run before the click, or never
fail at all. The ESLint rule `wdio/await-expect` catches the matcher case. (WDIO v9 has no
"sync mode" any more; it's async/await everywhere.)

### Hooks
- `onPrepare` runs **once in the main process** before any browser starts. Ours checks the app is
  up (`/api/health`), resets the database once (`POST /api/test/reset`), and deletes old results.
  It must be once: tests run in parallel, and a reset inside a test would wipe other tests' data.
- `afterTest` runs after **every attempt**. On failure it attaches a screenshot, the page source and
  the URL to Allure, and it always writes one line to `reports/results/<pid>.jsonl`.
- Mocha's own `beforeEach` is used in the mobile specs to restart the app before each test.

### Retries and FLAKY tests
`mochaOpts.retries: 1` re-runs a failed test once. Retrying alone would hide unreliable tests, so
`afterTest` records `test._currentRetry` (0 = first attempt, 1 = retry), and
[`scripts/lib/results.ts`](../scripts/lib/results.ts) marks a test **FLAKY** when it passed only
after a failed attempt. The CI job summary lists FLAKY tests separately. In the seeded-bug job a bug
counts as caught only if the test fails on both attempts.

### Reporters
- **spec**: the readable console output.
- **Allure** (`@wdio/allure-reporter`): writes raw results to `reports/allure-results`. CI turns
  them into HTML with Allure 3 (pure Node, no Java) and publishes one report per suite to GitHub
  Pages. Locally: `npm run report:allure`.
- Our own small JSONL recorder feeds the job summaries and the catch-rate table, because those
  need exact per-attempt data and must work without a browser.

### Tags: smoke and regression
Tags are just words in titles. Every `describe` contains `@regression`, and six `it` titles contain
`@smoke`. `--mochaOpts.grep @smoke` tells Mocha to run only tests whose full title matches.

---

## 3. How Appium works

**Appium** is a server that automates real mobile apps (not just browsers) through the same W3C
WebDriver protocol. It doesn't automate devices itself; it loads a **driver** for each platform.

```
tests/mobile/specs ─► WebdriverIO (client) ─► HTTP :4723 ─► Appium server ─► UiAutomator2 driver
      ─► adb ─► UiAutomator2 server app on the device ─► Android UiAutomator ─► the app under test
```

1. **Client**: WebdriverIO. Same `$`, `click`, `expect` as on the web.
2. **Appium server** (v3, a dev dependency here) listens on `127.0.0.1:4723`. `@wdio/appium-service`
   starts it; the config's `hostname`/`port` point WDIO at it.
3. **Driver**: `appium-uiautomator2-driver` (also a dev dependency, so `npm install` sets it up).
   It installs two small helper apps on the device and forwards a port to them.
4. **Device**: an emulator or a real phone, reached through `adb` (Android Debug Bridge).
5. The helper app uses Google's **UiAutomator** framework to find views and tap, type and swipe.

For iOS the picture is the same with the **XCUITest** driver, Xcode and a simulator or iPhone.

### Capabilities (from [`wdio.android.conf.ts`](../tests/mobile/wdio.android.conf.ts))
| Capability | Value | Meaning |
|---|---|---|
| `platformName` | `Android` | Which platform |
| `appium:automationName` | `UiAutomator2` | Which driver |
| `appium:deviceName` | `Android Emulator` | A label; with one device connected Appium uses it |
| `appium:app` | path to the APK | Appium installs this app and starts it |
| `appium:autoGrantPermissions` | `true` | No permission pop-ups in the way |
| `appium:newCommandTimeout` | 240 s | Keep the session alive while a slow emulator works |
| `appium:*Timeout` | 1 to 5 minutes | A cold CI emulator is slow to install apps |

### Accessibility id: the best mobile locator
`$('~input-email')` finds an element by its **accessibility id**: the `content-desc` on Android
and the `accessibilityIdentifier` on iOS. It is the best choice because:
- it works on **both platforms** with the same string;
- it's **fast** (a direct lookup, no XPath walk through the whole view tree);
- developers set it **on purpose** (in React Native, `testID`/`accessibilityLabel`), so it doesn't
  change when the layout or text changes. It's the mobile version of `data-testid`.

XPath works but is slow on mobile and breaks when the layout changes. We use other locators only
when there is no accessibility id: an Android resource id for system dialogs, or a text match when
the text is what we're checking (an error message).

### Native alerts
A native alert is drawn by Android, not by the app's own screens, so it has no accessibility ids.
[`NativeAlert.ts`](../tests/mobile/screens/NativeAlert.ts) uses resource ids: `android:id/message`
and `android:id/button1/2/3` (positive, negative, neutral). The title is different: React Native
uses the AndroidX dialog, whose title id is `com.wdiodemoapp:id/alert_title`. (The first CI run
proved this; see the stories in section 4.)

### Gestures
- **Swipe** ([`SwipeScreen.ts`](../tests/mobile/screens/SwipeScreen.ts)): `browser.swipe({ direction:
  'left', scrollableElement, percent })` sends a W3C **actions** sequence: finger down, move, finger up.
- **Scroll to an element** ([`FormsScreen.ts`](../tests/mobile/screens/FormsScreen.ts)): Android only
  reports views that are on screen, so a button below the fold can't be found until you scroll.
  `element.scrollIntoView({ direction: 'up', scrollableElement })` swipes until it is displayed.
  Unlike most commands it doesn't auto-wait, so we wait for the form first.

### Contexts: native vs web view
A hybrid screen has a `NATIVE_APP` context plus one `WEBVIEW_...` context per web view.
[`webview.spec.ts`](../tests/mobile/specs/webview.spec.ts) waits until `getContexts()` lists a
`WEBVIEW` context. Switching into it would let you use normal web selectors inside the app.

### Keeping tests independent
[`support/app.ts`](../tests/mobile/support/app.ts) calls `terminateApp` + `activateApp` before every
test: each test starts on the home screen with empty forms. It's much faster than reinstalling.

### Emulator vs real device
| | Emulator (AVD) | Real device |
|---|---|---|
| Cost | Free, unlimited | Hardware, or a device cloud (BrowserStack, Sauce Labs) |
| CI | Easy: created on every run, snapshot cached | Needs a device farm |
| Speed and reliability | Reset to a clean state anytime | Real performance, battery, memory |
| Realism | Good for logic and UI flows | Needed for gestures' feel, camera, biometrics, push, OEM quirks |

CI ([`android.yml`](../.github/workflows/android.yml)) uses `reactivecircus/android-emulator-runner`
on a Linux runner with KVM hardware acceleration, and caches a booted emulator snapshot.
To use a real phone: enable USB debugging, check `adb devices`, then `npm run test:mobile`.
Setup steps: [MOBILE_SETUP.md](MOBILE_SETUP.md).

---

## 4. Folder walkthrough and design choices

```
app/            the demo guest app (React + Express), with six switchable bugs
tests/web/      WebdriverIO web suite: pageobjects/, specs/, support/, two configs
tests/mobile/   WebdriverIO + Appium suite: screens/, specs/, support/, one config
test-data/      properties, languages and the seeded-bug map (JSON)
scripts/        CI helpers: summaries, catch-rate report, Pages index, APK download
.github/        CI workflow, Android workflow, a shared "start the app" action
practice/       the bug-hunt practice pack (find, explain and fix bugs)
docs/           strategy, bug reports, this guide, setup and exercises
```

### `app/`: the system under test
- `app/server/`: one Express server serves the API **and** the built React app on
  `http://localhost:4300`, so tests have one fixed URL. Data lives in memory (`store.ts`).
- `app/server/routes/test-support.ts`: the **dev inbox** (where tests read one-time codes, like a test
  mailbox), `POST /api/test/reset` and `POST /api/test/expire-code` (no waiting 10 minutes). A real
  team would keep such endpoints out of production builds.
- `app/shared/`: code used by both the browser and the server: pricing, stay rules, dates and
  **`seeded-bugs.ts`**, the one file that switches the six bugs on. Every changed line is marked
  `SEEDED BUG #n`, so `git grep "SEEDED BUG"` shows the whole "bug vs fixed" difference.
- `app/web/src/locales/*.json`: every visible string. A new language = a new JSON file.
- Every element a test needs has a **`data-testid`**. Money and dates also expose exact values
  (`data-amount`, `data-local-date`, `data-local-time`) so tests don't parse formatted text.

### `tests/web/`
- `pageobjects/`: one class per screen, exported as a single instance. `BasePage` has the shared
  helpers (`byTestId`). `Header` is a *component object* (it's on every page) and knows how to open
  the mobile menu, so the same tests run on desktop and phone sizes.
- `specs/`: 8 files, 71 tests. They read like a guest's actions; no selectors inside.
- `support/api-client.ts`: creates guests, bookings and orders through the API in milliseconds.
- `support/session.ts`: puts the session token in `localStorage`, so a test starts signed in
  without clicking through sign-in. Only `sign-in.spec.ts` signs in through the UI.
- `support/expected.ts` and `support/dates.ts`: the **test oracle**, written from the business rules
  and deliberately **not** imported from the app. A test that reuses the app's code would repeat the
  app's mistakes.
- `support/accessibility.ts`: runs axe-core and keeps only serious/critical WCAG 2.1 A/AA issues.
- `support/results-recorder.ts`: the JSONL per-attempt results behind the summaries.

### `tests/mobile/`
- `screens/`: screen objects (the mobile page objects), accessibility ids first.
- `specs/`: 9 tests: login (valid, invalid), sign-up (valid, mismatched passwords), forms and a native
  alert, navigation, swipe, WebView.
- `demo-app.ts`: the APK version and download URL. The binary is downloaded by
  `npm run mobile:download-app`, never committed.

### `test-data/`
- `properties.json` and `locales.json` drive the data-driven specs (booking prices, dining bills,
  local times, translations, and the 5 x 3 property x language matrix).
- `seeded-bugs.json` says which tests are expected to catch each seeded bug.

### Design choices, and why
| Choice | Why |
|---|---|
| Page Object Model, selectors only in page objects | When the UI changes, one file changes, not 20 tests |
| `data-testid` selectors | Stable through redesigns and translations, unlike CSS classes or text |
| Test data through the API, unique email per test | Fast setup, no shared state, safe in parallel |
| One reset in `onPrepare`, never per test | Parallel tests would delete each other's data |
| Exact values in attributes (`data-amount`) | Same assertion in every language, currency and browser |
| Independent oracle (`expected.ts`) | A test must be able to disagree with the app |
| Retries 1 + FLAKY report | Keeps CI green on a one-off glitch without hiding unreliable tests |
| Seeded bugs in one small file | The bug/fix difference is easy to read and explain |
| API tests in the same WDIO runner | Same helpers, same report; shows API + UI layering without another tool |
| Custom date picker with test ids | Native `<input type=date>` behaves differently per browser and language |
| Chrome mobile emulation for mobile web | Fast, runs anywhere; real devices stay a release check |
| Appium + driver as dev dependencies | `npm install` sets up everything; no global installs |
| Allure 3 (Node) | HTML reports without installing Java |
| WebdriverIO 9 | The current widely used major; the axe-core integration supports it |

### Bugs this suite found while I built it
These are real, and they make good answers to "tell me about a bug you found":
1. **A Firefox-only sign-out.** The FLAKY report showed tests passing only on retry in Firefox. The
   Allure URL attachment showed the guest was bounced to sign-in. Root cause: the app's session code
   deleted the token on *any* failed `/api/me` call, and Firefox cancels in-flight requests when the
   page navigates, so a cancelled request signed the guest out. Fix: only clear the token on HTTP
   401 ([`session.tsx`](../app/web/src/session.tsx)).
2. **Writing to `localStorage` too early.** The session helper sometimes failed in Firefox with a
   SecurityError: it wrote before the app's document had loaded. Fix: wait for the header to exist
   first (an explicit wait, not a sleep).
3. **A seeded bug caught only sometimes.** The double-click test was meant to catch bug #5 but passed
   now and then: the local server answered in ~5 ms, so the page navigated away before the second
   click (56 ms later). Fix: give the order endpoint a realistic 400 ms "kitchen system" delay, as a
   real network would have. Lesson: a test that catches a bug *sometimes* doesn't catch it.
4. **The first Android CI run.** Two tests waited for an alert that was clearly on screen. The
   screen hierarchy (XML) attached to the failure showed the title's id was
   `com.wdiodemoapp:id/alert_title`, not `android:id/alertTitle`: React Native uses the AndroidX
   dialog. A third test couldn't find a button because the CI emulator's screen is small (320x640)
   and Android doesn't report off-screen views. Fix: scroll to it. The next run showed the scroll
   started before the screen had rendered (`scrollIntoView` doesn't auto-wait), so the screen object
   now waits for the form first. Lesson: read the evidence (screenshot, XML, Appium log) before
   changing timeouts.

---

## 5. A 2-minute demo script

Have three tabs open: the latest CI run summary, the repo on GitHub, and the Allure reports page.

**0:00 to 0:20. What it is.**
"This is Concierge QA: a WebdriverIO and Appium framework for a hotel guest app. The app is a
fictional brand I built so I could test realistic flows: booking, in-room dining, guest requests,
chat, five properties in different time zones, and three languages. One framework covers desktop
web, mobile web and a native Android app."

**0:20 to 0:50. Proof it works.** *(CI run summary)*
"Every push runs a one-minute smoke suite on Chrome, then the full regression on Chrome and Firefox
in parallel, mobile web on iPhone and Pixel sizes, and Appium on an Android emulator. Each job writes
a summary: passed, failed, flaky and time, so nobody has to download logs. Tests that only pass on
retry are flagged as FLAKY instead of hidden."

**0:50 to 1:20. The headline: does it catch real bugs?** *(Seeded-bugs job summary)*
"The app can switch on six realistic regressions: service charge calculated on tax, check-out on the
check-in day, dates in the wrong time zone, a missing French translation, a double-click creating
two orders, and a sign-in code field one digit short. This job runs the suite against that build and
only passes if all six are caught. It shows 6 out of 6, and which test caught each one."

**1:20 to 1:45. Scale.** *(`test-data/properties.json` and `property-matrix.spec.ts`)*
"Tests are data-driven. Every property is a line of JSON, and the specs loop over properties and
languages. Adding a hotel or a language is a one-line change and adds every combination
automatically. That's how this would grow to a hundred properties without new test code."

**1:45 to 2:00. Mobile and next steps.** *(`NativeAlert.ts` or `FormsScreen.ts`)*
"The Appium suite uses screen objects and accessibility ids, handles native alerts and swipes, and
runs on an emulator in CI. Next I'd add iOS with XCUITest and run the same specs on a device cloud."

---

## 6. 25 interview questions with short answers

**Framework design**

1. **Why page objects?**
   They keep *how to find things* separate from *what the test checks*. Selectors live in one place,
   so a UI change means editing one page object, and specs read like a guest's steps.

2. **Why `data-testid` selectors?**
   They exist only for testing, so they don't change with redesigns (CSS classes) or translations
   (text). On mobile the equivalent is the accessibility id.

3. **How do your tests stay independent and run in parallel?**
   Each test creates its own guest with a unique email through the API, and its own bookings and
   orders. Nothing is shared, and the database is reset only once, before the run. So the order
   doesn't matter and five browsers can run at once.

4. **Why create test data through the API instead of the UI?**
   Speed and focus. Signing in through the UI takes seconds; the API takes milliseconds. Each UI test
   should test one screen; the sign-in UI has its own tests. It's the "API + UI layering" idea.

5. **How do smoke and regression work?**
   They're tags in the test titles. `--mochaOpts.grep @smoke` runs the six critical-path tests in
   about a minute; `@regression` runs all 71. Smoke runs first in CI, and the cross-browser jobs wait for it.

6. **Why are the API tests in the WebdriverIO runner and not a separate tool?**
   They share the same helpers, config and report, and they show the layering: business rules are
   checked quickly at the API level, and the UI tests check what the guest sees.

**Waiting and flakiness**

7. **How do you avoid flaky tests?**
   No sleeps, only explicit waits and retrying matchers. Test data is isolated. Assertions use exact
   attributes, not formatted text. The app has stable test ids. And I fix the root cause: two of my
   own app bugs were found because tests were flaky in Firefox.

8. **How do you know when a test is flaky?**
   Tests retry once, and `afterTest` records each attempt. If a test fails and then passes, the
   summary marks it FLAKY. It's visible in every CI job summary, so it gets fixed instead of ignored.

9. **What's the difference between `await expect(el).toHaveText('x')` and `expect(await el.getText()).toBe('x')`?**
   The first retries until the text matches or the timeout ends. The second reads the text once,
   right now, and fails if the page hasn't updated yet. The first is the right one for UI.

10. **Why not `browser.pause`?**
    A fixed sleep is a guess: too short on a slow machine (flaky), too long everywhere else (slow).
    Waiting for a condition is both faster and reliable. Here it's a lint error.

11. **What happens if you forget an `await`?**
    The command runs in the background and the test continues. An assertion may run before the
    action, or a failing assertion may never be reported. The ESLint rule `wdio/await-expect` catches it.

**Business risks**

12. **How does the seeded-bug job work, and why does it matter?**
    The app has six switchable regressions in one file. CI starts it with `BUG_MODE=on`, runs the
    regression suite, and a script maps the failures to the bugs using `test-data/seeded-bugs.json`.
    The job passes only at 6/6. It proves the tests actually detect real bugs, not just that they're green.

13. **Why do tests read `data-amount` instead of the price text?**
    Prices are integers in minor units, so there are no floating-point errors. Formatted text differs
    by language and browser ("€1,234.50" vs "1 234,50 €"), so the exact value in an attribute gives
    one assertion that works everywhere.

14. **How do you test time zones?**
    Check-in is 15:00 in the hotel's time zone. The test creates a booking and checks the
    confirmation shows the hotel's local date and time for every property. CI fixes the browser to
    Toronto time, and the hotels include zones far ahead (Tokyo) and behind (Maui), so a
    "browser time zone" bug can't hide.

15. **How do you test localization?**
    Three layers: a static check that every locale file has the same keys; UI tests that the main
    screens in every language show no raw keys; and the property x language matrix. A new language
    in `locales.json` adds its tests automatically.

16. **How does the accessibility check work, and what can't it catch?**
    axe-core scans ten key page states for WCAG 2.1 A and AA rules and fails on serious or critical
    issues. It catches missing labels, contrast and ARIA mistakes, but not whether a screen reader
    journey makes sense, so manual checks with VoiceOver and TalkBack are still needed.

17. **How would this scale to 130+ properties?**
    Properties are data. Adding one is a JSON line, and every data-driven test covers it. With
    130 properties I'd run the full matrix nightly, sharded across machines, and a risk-based subset
    (one property per currency and time zone group) on every push.

**Mobile**

18. **Why accessibility id on mobile?**
    Same string on Android and iOS, fast lookup, and set on purpose by developers, so it survives
    layout and text changes. XPath is slow and fragile on mobile.

19. **How does WebdriverIO talk to Appium?**
    The same way it talks to a browser driver: WebDriver commands over HTTP. Appium listens on port
    4723, picks the UiAutomator2 driver from the capabilities, and the driver controls the device
    through a helper app.

20. **Emulator or real device?**
    Emulators for CI: free, clean every run, easy to parallelize. Real devices for performance,
    gestures, camera, biometrics and manufacturer quirks, usually through a device cloud before a release.

21. **How would you add iOS?**
    Add a `wdio.ios.conf.ts` with `platformName: 'iOS'`, `appium:automationName: 'XCUITest'` and the
    `.app`/`.ipa`, install the XCUITest driver, and run it on a macOS CI runner. Screen objects
    mostly stay the same because accessibility ids work on both; platform-specific parts (like native
    alerts) get an iOS selector behind the same method.

**Process**

22. **How would you run this on BrowserStack?**
    Use the `@wdio/browserstack-service`, set the user name and access key from environment
    variables (never in the repo), and change the capabilities to the devices you want. The specs
    don't change.

23. **How do you debug a failing test in CI?**
    Start with the job summary for the error, then the Allure report: screenshot, page source (or
    the screen hierarchy XML on mobile) and URL. For Appium there's also the Appium server log. Then
    reproduce locally with `HEADED=true`. The Android fixes in this repo came from reading the XML
    and the Appium log, not from raising timeouts.

24. **Tell me about a bug your tests found.**
    In Firefox some tests passed only on retry, and the FLAKY report made it visible. The Allure
    attachments showed guests being sent back to sign-in. Firefox cancels requests when a page
    navigates, and the app deleted the session token on any error, including a cancelled request.
    I changed it to clear the token only on a 401. That's a real bug guests would have hit.

25. **What would you improve next?**
    iOS with XCUITest, running on a device cloud, visual regression for brand-critical screens,
    linking tests to TestRail cases, and contract tests between the apps and the API. Details below.

---

## 7. What I would add next

- **iOS** with the XCUITest driver on a macOS runner, sharing the screen-object structure.
- **A device cloud** (BrowserStack or Sauce Labs) for real phones and Safari, configured from
  environment variables and off by default.
- **Visual regression** on brand-critical screens (property pages, confirmation), reviewed by a person.
- **TestRail (or similar) integration**: case IDs in test titles and results pushed after each run, so
  manual and automated coverage live in one place.
- **Contract tests** (an OpenAPI schema check or Pact) so web, iOS and Android agree with the API.
- **Sharding and a nightly full matrix** once there are many properties and languages.
- **Performance checks** (Lighthouse CI) on the booking flow over a throttled "hotel Wi-Fi" network.
- **Automatic bug tickets**: a failed main-branch run opens a Jira issue with the Allure link.
