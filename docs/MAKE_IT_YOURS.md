# Make it yours: four hands-on tasks

Reading code teaches you what it does; changing it teaches you why. Do these tasks by hand, in
order. Each has hints, but no full solution: the struggle is the point. Use a branch
(`git switch -c practice`) so you can always get back to the original.

Before you start: `npm install`, then `npm run app` in one terminal (leave it running) and use a
second terminal for the tests.

| # | Task | Time | You will practise |
|---|---|---|---|
| 1 | [Test the Spa booking feature](#task-1-test-the-spa-booking-feature) | 60 to 90 min | Page objects, API setup, waits, isolation |
| 2 | [Fix seeded bug #3 (time zones)](#task-2-fix-seeded-bug-3-time-zones) | 30 min | Reading app code, the seeded-bug gate |
| 3 | [Add "Aurelle Lisbon" with JSON only](#task-3-add-aurelle-lisbon-with-json-only) | 30 min | Data-driven tests |
| 4 | [Add an Appium test](#task-4-add-an-appium-test) | 45 to 60 min | Screen objects, accessibility ids, gestures |

---

## Task 1: Test the Spa booking feature

The app has a Spa page (`/properties/<id>/spa`) with **no automated tests on purpose**. Write a
page object and two tests for it.

**Goal**
- `tests/web/pageobjects/SpaPage.ts`, following the style of the other page objects.
- `tests/web/specs/spa.spec.ts` with two tests, both tagged `@regression` (put the tag in the `describe`).
  1. **Happy path**: a guest books a treatment and sees the confirmation message.
  2. **A rule**: booking a time slot that is already taken shows an error.

**Hints**
- Find the test ids yourself: open the page in Chrome, right-click → Inspect, and look for
  `data-testid`. Or read `app/web/src/pages/SpaPage.tsx`. You should find ids for the title, each
  treatment, the date, the time, the book button, the confirmation and the error.
- The date and time are `<select>` elements. Look at how `BookingPage.chooseGuests()` selects an option.
- Start each test signed in without the UI: `api.createGuest()` and `openAs()` from `tests/web/support/`.
- For test 2, create the first booking **through the API** (it's setup, not what you're testing), then
  try the same treatment, date and time in the UI. The API is `POST /api/spa/bookings` with
  `propertyId`, `treatmentId`, `date` (YYYY-MM-DD) and `time` (e.g. `"15:00"`). Add a small
  `createSpaBooking` helper to `support/api-client.ts`, modelled on `createBooking`.
- **Careful, this is the interesting part:** unlike room bookings, a spa slot is shared by *all*
  guests. If your two tests (or two parallel runs) choose the same slot, they will interfere with
  each other. How can each test make sure its slot is its own? (Think about which property, date
  and time each test uses.)
- Don't hard-code today's date. `support/dates.ts` has helpers that work in the hotel's time zone.
- Assert with the waiting matchers (`toBeDisplayed`, `toHaveText`), never with a sleep.

**Check yourself**
```bash
npx wdio run tests/web/wdio.conf.ts --spec tests/web/specs/spa.spec.ts
npm run typecheck && npm run lint
npx cross-env BROWSER=firefox wdio run tests/web/wdio.conf.ts --spec tests/web/specs/spa.spec.ts
```
Run it three times in a row. If it ever fails, find out why before moving on.

---

## Task 2: Fix seeded bug #3 (time zones)

With the bug on, the booking confirmation shows check-in and check-out in the *browser's* time zone
instead of the hotel's (see [AUR-3 in BUG_REPORTS.md](BUG_REPORTS.md#aur-3)). Fix it in the app and
watch the tests turn green.

**Steps**
1. Stop `npm run app` and start the app with only bug #3 on:
   ```bash
   npx cross-env BUG_MODE=3 npm run app
   ```
2. In the second terminal, run the time zone tests and watch them fail for Paris, Tokyo, Dubai and Maui:
   ```bash
   npx wdio run tests/web/wdio.conf.ts --spec tests/web/specs/booking.spec.ts --mochaOpts.grep "local time"
   ```
   Why does Toronto pass? (Hint: what time zone is your computer in?)
3. Find the bug: `git grep "SEEDED BUG #3"`.
4. Fix it so the page is correct **even when bug #3 is switched on**. Restart the app (it rebuilds the
   web app on start) and run the tests again until they pass.

**Hints**
- Read the comment above the marked line. What value does `timeZone` get when the bug is on?
- What does `Intl.DateTimeFormat` do when its `timeZone` option is `undefined`?
- Open a Tokyo booking's confirmation in the browser before and after your fix and compare the times.

**Then see the safety net work**
```bash
npx cross-env BUG_MODE=on npm run app      # all six bugs on (restart the app)
npm run test:seeded-bugs                   # second terminal
```
The report now says **5/6 caught** and exits with an error, because bug #3 no longer breaks anything.
That is the gate doing its job: in CI this job would fail and tell you the suite lost a safety net.
Undo your change afterwards with `git checkout -- app/web/src/format.ts` (or by switching branch).

---

## Task 3: Add "Aurelle Lisbon" with JSON only

The pitch is that a new property needs no new test code. Prove it.

**Goal.** Add an "Aurelle Lisbon" property (time zone `Europe/Lisbon`, currency `EUR`) by editing
JSON files only, and show that the data-driven tests pick it up.

**Hints**
- There are two JSON files, one for each side:
  - `app/server/data/properties.json`: the **app's** catalog (what a CMS would hold). Copy an existing
    entry and change the id, names, city and country (in all three languages), time zone, currency
    and rates. Keeping the room and menu ids of the entry you copied is the easiest way to start.
  - `test-data/properties.json`: what the **tests** expect. Its `testRoom` and `testOrder` must match
    rooms, dishes and prices that really exist in your new catalog entry.
- Restart the app after changing the catalog (it reads the file on start).
- Before you add it, run `npm run test:regression` and note the number of tests. After adding it,
  count again. Which tests are new? (Look for "Lisbon" in the output.) You should be able to explain
  exactly where each new test comes from by reading the `for (const hotel of properties)` loops.
- Bonus: Lisbon is UTC+0 in winter and UTC+1 in summer. In the app, book a January stay and a July
  stay and compare the confirmation pages. Why do both say check-in is at 3:00 PM?

**Check yourself**
- The Properties page shows the new card with Lisbon's local time.
- `git diff --stat` shows only `.json` files changed.

---

## Task 4: Add an Appium test

Add one new test to the Android suite for the WebdriverIO demo app.

**Pick one** (easiest first):
1. **Find the hidden logo**: on the **Swipe** screen, scroll *down* the page (not the carousel) until
   the WebdriverIO logo and the text "You found me!!!" appear.
2. **Choose from the dropdown**: on the **Forms** screen, open the dropdown and choose
   "Appium is awesome", then check the field shows it.
3. **Drag and drop** (harder): on the **Drag** screen, drag a puzzle piece onto its target.

**Hints**
- Find accessibility ids with [Appium Inspector](https://github.com/appium/appium-inspector), or print
  the screen hierarchy in a test with `console.log(await browser.getPageSource())` and look for
  `content-desc`. Prefer accessibility ids (`~...`); read the comment in `screens/BaseScreen.ts`.
- Add getters and actions to the right screen object (create `DragScreen.ts` if you choose 3), never
  selectors in the spec.
- Start the test with `restartApp()` in a `beforeEach`, like the other specs.
- Option 1: `FormsScreen.tapActiveButton()` already scrolls to an element that starts off-screen.
  Which scrollable element do you need on the Swipe screen?
- Option 2: the dropdown opens an Android list, which isn't part of the app's own screen. How did
  `NativeAlert.ts` find things that have no accessibility id?
- Option 3: look at `browser.action('pointer')` in the WebdriverIO docs, or `dragAndDrop`.

**Run it**
- Locally, if you have an emulator ([MOBILE_SETUP.md](MOBILE_SETUP.md)):
  `npx wdio run tests/mobile/wdio.android.conf.ts --spec tests/mobile/specs/<your-spec>.spec.ts`
- Or push your branch and run **Actions → Android (Appium) → Run workflow**. If it fails, open the
  Allure report: the screenshot and the screen hierarchy (XML) usually show why.
