# Test strategy: a hotel guest app

How I would test a guest app like Aurelle (booking, in-room dining, guest requests, concierge chat;
web, mobile web and native; many properties, currencies, time zones and languages), and how this
repo puts it into practice.

## 1. Risks, highest first

Effort goes where a bug would cost a guest money, a night's stay or their trust.

| # | Area | What can go wrong | Automated here | Still manual |
|---|---|---|---|---|
| 1 | **Booking, pricing, payments** | Wrong totals; impossible stays (0 nights, past dates, too many guests); charging twice | Price maths per property, date and guest rules in UI **and** API, double-submit, idempotency, API contract | Payment provider flows (3-D Secure, declines, refunds) in its sandbox |
| 2 | **Sign-in and sessions** | Guests locked out; one guest seeing another's data | Code valid / wrong / expired, session survives reload, sign-out kills the token, 401 and 404 checks | Email delivery, account recovery |
| 3 | **Time zones and dates** | Hotel dates shown in the guest's zone; "today" differs at the hotel | Hotel local check-in time for every property; "no past dates" uses the hotel's today; fixed CI time zone; hotels on both sides of UTC | Stays across a DST change |
| 4 | **Localization** | Raw keys, missing translations, wrong formats | No raw keys on key screens per language; key parity lint; property x language matrix | Translation quality, text overflow, right-to-left |
| 5 | **Accessibility** | Screen reader or keyboard users can't book | axe-core on 10 page states, fails on serious/critical WCAG 2.1 AA issues | VoiceOver/TalkBack journeys, keyboard only, 200% zoom |
| 6 | **Notifications and live status** | Order or request status never updates | Staff status change (via API) shows on the guest's page without a reload | Push notifications and emails on real devices |

## 2. What to automate and what to keep manual

**Automate** what is repeated every release, has a clear right answer and would hurt if it broke:
money maths, booking rules, sign-in, the property x language matrix, accessibility rules, one happy
path per feature. Automation answers "is it *still* right?" in minutes, on every change.

**Keep manual** what needs human judgement or real hardware:
- **Exploratory testing** of every new feature, with a short charter. Most surprising bugs are found this way.
- **Visual polish and brand feel**: a luxury brand lives on details a script can't judge.
- **Real-device feel**: gestures, the keyboard covering fields, slow hotel Wi-Fi, camera, biometrics.
- **Usability and copy**: does the flow make sense to a tired guest at 1 a.m.?

Layers in this repo: static checks (strict TypeScript, ESLint that bans `browser.pause`, locale key
parity), fast API tests for rules and contracts, one focused UI journey per test with data created
through the API, the Appium suite, and a seeded-bug run that proves the suite catches six realistic
regressions.

## 3. Device and browser matrix

| Platform | Suite | Where | When |
|---|---|---|---|
| Chrome desktop | Full regression (71 tests) | CI, headless | Every push to `main` and every pull request |
| Firefox desktop | Full regression | CI, headless | Every push to `main` and every pull request |
| Mobile web: iPhone-size and Pixel-size | Smoke | CI, Chrome mobile emulation | Every push to `main` and every pull request |
| Android native, API 34 emulator | Appium suite | CI, Android emulator | Every push to `main`, or on demand |
| Safari on iPhone, Chrome on Android (latest and one older OS) | Smoke + exploratory | Real devices or a device cloud | Before each release |

Known gap: Safari/WebKit is not automated (Safari's WebDriver needs macOS). Chrome emulation catches
layout bugs early but is not a real phone, so real devices stay in the release checklist.

## 4. Smoke vs regression

- **Smoke** (`@smoke`, 6 web tests, about a minute): sign in, book, order and track it, send a request,
  chat, API health. The cross-browser regression and mobile web jobs wait for it, so a broken build
  fails within about a minute, before those longer runs start.
- **Regression** (`@regression`, all 71 web tests): Chrome and Firefox in parallel, plus mobile web
  smoke, the seeded-bug run and the Android suite.
- **Flaky tests**: a failed test is retried once, and a test that passes only on the retry is reported
  as **FLAKY**. Flaky tests get fixed or quarantined with a ticket, never quietly retried forever.

## 5. Entry and exit criteria for a release

**Entry** (release testing can start): the build is on the test environment and smoke is green; the
changes are described in tickets or release notes; test data is ready; no Blocker is open from the
previous cycle.

**Exit** (OK to release):
- Regression green on Chrome and Firefox; mobile web smoke and Android green; no unexplained FLAKY tests.
- The seeded-bug run still catches 6/6 (the safety net itself still works), and the accessibility gate is green.
- No open Blocker or Critical bugs; every open Major has an owner and an agreed workaround.
- Every new feature had an exploratory session, and real-device checks passed.
- The product owner has signed off.
