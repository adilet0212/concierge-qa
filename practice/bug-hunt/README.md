# Bug hunt: "find the bug" practice pack

Short, realistic pieces of code with bugs in them, themed around a hotel guest app
(room prices, dining carts, dates and time zones, API calls) and around WebdriverIO test code.
Each one is meant to be **solved by reading first**, out loud, and then **confirmed by running a test**.

Start with [HOW_TO_DEBUG_IN_INTERVIEW.md](HOW_TO_DEBUG_IN_INTERVIEW.md): a one-page method and
the 15 most common JavaScript gotchas.

## How to practise
1. Open an exercise folder and read its `README.md` (what the code should do, with examples).
2. Read the code. Find the bug **before** running anything, and say out loud what you think is wrong.
3. Run the test, fix the code, run it again until it is green:
   ```bash
   npm run bug-hunt -- js-08
   ```
4. Compare with [ANSWERS.md](ANSWERS.md) and the fixed code in `solutions/`.

Other commands:
```bash
npm run bug-hunt                      # list every exercise
npm run bug-hunt -- js-08 --solution  # run the same test against the fixed version
npm run bug-hunt:verify               # prove every exercise fails as written and passes when fixed
npm run bug-hunt:verify:wdio          # same for the WebdriverIO exercises (start the app first: npm run app)
```

To reset an exercise after practising, restore it with git: `git checkout -- practice/bug-hunt/exercises/js-08-nightly-charges`.

## Exercises
Difficulty: ●○○ warm-up · ●●○ typical · ●●● hard. READMEs never say where the bug is.

### JavaScript (22)
| # | Exercise | Difficulty |
|---|---|---|
| 01 | [Menu labels](exercises/js-01-menu-labels) | ●○○ |
| 02 | [Cheapest rate](exercises/js-02-cheapest-rate) | ●○○ |
| 03 | [Find an available room](exercises/js-03-find-available-room) | ●○○ |
| 04 | [Request ETA](exercises/js-04-request-eta) | ●○○ |
| 05 | [Guest greeting](exercises/js-05-guest-greeting) | ●○○ |
| 06 | [Arrival date label](exercises/js-06-arrival-date-label) | ●○○ |
| 07 | [Stay search from the URL](exercises/js-07-stay-search-params) | ●○○ |
| 08 | [Nightly charges](exercises/js-08-nightly-charges) | ●○○ |
| 09 | [Confirm a booking](exercises/js-09-confirm-booking) | ●○○ |
| 10 | [Room numbers from a pasted list](exercises/js-10-room-numbers) | ●●○ |
| 11 | [Allergy flags on kitchen tickets](exercises/js-11-dietary-flags) | ●●○ |
| 12 | [Booking reference check](exercises/js-12-booking-reference) | ●●○ |
| 13 | [Top-rated rooms](exercises/js-13-top-rated-rooms) | ●●○ |
| 14 | [Group bookings from a template](exercises/js-14-booking-from-template) | ●●○ |
| 15 | [Wake-up calls](exercises/js-15-wake-up-calls) | ●●○ |
| 16 | [Concierge request queue](exercises/js-16-request-queue) | ●●○ |
| 17 | [Room status filter](exercises/js-17-room-status-filter) | ●●○ |
| 18 | [In-room dining bill](exercises/js-18-dining-bill) | ●●○ |
| 19 | [Checkout reminders](exercises/js-19-checkout-reminders) | ●●○ |
| 20 | [Property details loader](exercises/js-20-property-loader) | ●●○ |
| 21 | [Tonight's rates across properties](exercises/js-21-rate-comparison) | ●●● |
| 22 | [Today's date at the hotel](exercises/js-22-hotel-local-date) | ●●● |

### TypeScript reading (3)
| # | Exercise | Difficulty |
|---|---|---|
| 01 | [Room availability](exercises/ts-01-room-availability) | ●●○ |
| 02 | [Booking summary from the API](exercises/ts-02-booking-summary) | ●●○ |
| 03 | [Suggested tip](exercises/ts-03-dining-tip) | ●○○ |

### WebdriverIO test code (8)
These run against the Aurelle demo app, so start it first with `npm run app`.
"Runnable" exercises fail as written. "Read and explain" ones may even pass, and that is the problem to explain.

| # | Exercise | Difficulty | Type |
|---|---|---|---|
| 01 | [Cart quantity test](exercises/wdio-01-cart-quantity) | ●○○ | read and explain |
| 02 | [New order status test](exercises/wdio-02-order-status) | ●○○ | read and explain |
| 03 | [Sign-in code step test](exercises/wdio-03-sign-in-code-step) | ●●○ | runnable |
| 04 | [Mobile menu button on desktop](exercises/wdio-04-mobile-menu) | ●●○ | runnable |
| 05 | [Booking confirmation heading](exercises/wdio-05-confirmation-heading) | ●○○ | runnable |
| 06 | [Booking journey](exercises/wdio-06-booking-journey) | ●●○ | read and explain |
| 07 | [Order history](exercises/wdio-07-order-history) | ●●● | read and explain |
| 08 | [Order tracking page object](exercises/wdio-08-order-page-object) | ●●● | runnable |

### Interview simulations (3)
40 to 60 lines, several bugs each. The closest thing to a real round: set a 15-minute timer.

| # | Exercise | Difficulty |
|---|---|---|
| 01 | [Dining cart](exercises/sim-01-dining-cart) | ●●● |
| 02 | [Stay validator](exercises/sim-02-stay-validator) | ●●● |
| 03 | [API client with retries](exercises/sim-03-api-client) | ●●● |

### Mock rounds
[mock-rounds/](mock-rounds/README.md): three timed 20-minute rounds with exercises you have
**not** seen before. Don't open those folders until you sit down for a round.
