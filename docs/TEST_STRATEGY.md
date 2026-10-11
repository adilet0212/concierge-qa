# Test strategy: a hotel guest app

How I would test a guest app like Aurelle (booking, in-room dining, guest requests, concierge chat;
web, mobile web and native; many properties, currencies, time zones and languages), and how this
repo puts that into practice.

## 1. Risks, highest first

Effort goes where a bug would cost a guest money, a night's stay or their trust.

| # | Area | What can go wrong | Automated here | Still manual |
|---|---|---|---|---|
| 1 | **Booking, pricing, payments** | Wrong totals, taxes or fees; impossible stays (0 nights, past dates, too many guests); charging twice | Price maths for every property (data-driven), date and guest rules in UI **and** API, double-submit and idempotency, API contract | Real payment provider flows (3-D Secure, declines, refunds) in its sandbox |
| 2 | **Sign-in and sessions** | Guests locked out; one guest seeing another's data | One-time code (valid, wrong, expired), session survives reload, sign-out kills the server token, 401 without a session, 404 for someone else's booking | Email delivery and spam filtering, account recovery |
| 3 | **Time zones and dates** | Dates shown in the guest's zone instead of the hotel's; "today" is different at the hotel; daylight saving | Check-in/out in hotel local time for every property; "no past dates" uses the hotel's today; fixed browser time zone in CI; hotels on both sides of UTC (Tokyo, Maui) | Bookings that cross a DST change, travel across the date line |
| 4 | **Localization** | Raw keys, missing translations, wrong number/date formats | No raw keys on key screens in every language; same keys in every locale file (`npm run lint:locales`); every property x every language | Translation quality, text overflow in long languages, right-to-left layouts |
| 5 | **Accessibility** | Guests who use screen readers or keyboards can't book | axe-core scan of 10 key page states; fails on serious/critical WCAG 2.1 AA issues | Screen reader passes (VoiceOver, TalkBack), keyboard-only journeys, 200% zoom |
| 6 | **Notifications and live status** | Order or request status never updates; guest isn't told | Status set by staff (through the API) appears on the guest's page without a reload | Push notifications and emails on real devices |

## 2. What to automate and what to keep manual

**Automate** checks that are repeated every release, have a clear right answer, and would hurt if
they broke: money maths, booking rules, sign-in, the property x language matrix, accessibility rules,
and one happy path per feature. Automation answers "is it *still* right?" in minutes, on every push.

**Keep manual** what needs human judgement or real hardware:
- **Exploratory testing** of every new feature, with a short charter ("try to book a room you can't
  afford to cancel"). Most surprising bugs are found this way.
- **Visual polish and brand feel**: spacing, imagery, animations. A luxury brand lives on details a
  script can't judge. (Visual regression tools can flag changes, but a person decides.)
- **Real-device feel**: gestures, the on-screen keyboard covering fields, slow hotel Wi-Fi, camera,
  biometrics, notifications, battery and memory on older phones.
- **Usability and copy**: does the flow make sense to a tired guest at 1 a.m.?

## 3. Test layers in this repo

| Layer | What it checks | Speed |
|---|---|---|
| Static checks | TypeScript strict, ESLint (bans `browser.pause`, requires `await expect`), locale key parity | seconds |
| API tests | Status codes, contract, validation, permissions, idempotency | ~1 s each |
| UI tests (WebdriverIO) | One focused journey per test; data created through the API first | 2 to 10 s each |
| Native app (Appium) | Forms, validation, native alerts, gestures, navigation, WebView | 5 to 60 s each |
| Seeded-bug run | The suite fails for each of 6 realistic regressions (it proves the tests work) | one regression run |

## 4. Device and browser matrix

| Platform | Suite | Where | When |
|---|---|---|---|
| Chrome desktop | Full regression (71 tests) | CI, headless | Every push and pull request |
| Firefox desktop | Full regression | CI, headless | Every push and pull request |
| Mobile web: iPhone-size and Pixel-size | Smoke | CI, Chrome mobile emulation | Every push and pull request |
| Android native, API 34 emulator | Appium suite | CI, Android emulator | Every push to `main`, or on demand |
| Safari on iPhone, Chrome on Android (latest and one older OS) | Smoke + exploratory | Real devices or a device cloud | Before each release |

Known gap: Safari/WebKit is not automated (Safari's WebDriver needs macOS). Chrome emulation catches
layout bugs early, but it is not a real phone, which is why real devices stay in the release checklist.

## 5. Smoke vs regression

- **Smoke** (`@smoke`, 6 web tests, about a minute in CI): sign in, book, order and track it, send a
  request, chat, API health. The cross-browser regression and mobile web jobs wait for it, so a
  broken build fails in about a minute without using a full regression run.
- **Regression** (`@regression`, every web test): Chrome and Firefox in parallel, plus mobile web
  smoke, the seeded-bug run and the Android suite.
- **Flaky tests**: each failed test is retried once, but a test that passes only on the retry is
  reported as **FLAKY** in the CI summary. Flaky tests get fixed or quarantined with a ticket, never
  quietly retried forever.

## 6. Entry and exit criteria for a release

**Entry** (release testing can start):
- The build is deployed to the test environment and the smoke suite is green.
- Release notes or tickets describe what changed; test data and accounts are ready.
- No Blocker bugs left open from the previous cycle.

**Exit** (OK to release):
- Regression is green on Chrome and Firefox, mobile web smoke and the Android suite are green, with
  no unexplained FLAKY tests.
- The seeded-bug run still catches 6/6 (the safety net itself still works).
- The accessibility gate is green.
- No open Blocker or Critical bugs. Every open Major has an owner and an agreed workaround.
- Every new feature had an exploratory session, and real-device checks passed.
- The product owner has signed off.
