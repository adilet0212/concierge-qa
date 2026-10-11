# Bug reports: the six seeded regressions

The demo app can switch on six realistic regressions (`BUG_MODE=on`, see
[`app/shared/seeded-bugs.ts`](../app/shared/seeded-bugs.ts)). The CI job **"Seeded bugs"** runs the full
regression suite against that build and fails unless every bug is caught. These are the reports a
QA engineer would file for them. The "Caught by" lines and assertion messages are copied from that
job's results.

| ID | Title | Severity | Priority | Caught by |
|---|---|---|---|---|
| [AUR-1](#aur-1) | Dining service charge is calculated on the tax too, overcharging every order | Major | P1 | `dining.spec.ts` (5 tests) |
| [AUR-2](#aur-2) | Guest can check out on the check-in date and book 0 nights for 0.00 | Critical | P1 | `booking.spec.ts`, `api.spec.ts` |
| [AUR-3](#aur-3) | Confirmation shows check-in/out in the guest's time zone, not the hotel's | Major | P1 | `booking.spec.ts` (4 tests) |
| [AUR-4](#aur-4) | French confirmation title shows the raw key `booking.confirm.title` | Minor | P2 | `localization.spec.ts` (2 tests) |
| [AUR-5](#aur-5) | Double-clicking "Place order" creates two orders | Major | P1 | `dining.spec.ts` |
| [AUR-6](#aur-6) | Sign-in code field accepts only 5 digits; the emailed code has 6 | Blocker | P1 | `sign-in.spec.ts` (3 tests, incl. smoke) |

**Severity** is the impact on the guest or the business. Blocker: a core journey is impossible.
Critical: data or money is wrong in a way that can't be easily undone. Major: a core journey gives a
wrong result. Minor: cosmetic or partial.
**Priority** is how soon to fix it. P1: before release. P2: in this release if possible. P3: backlog.

**Common environment** (unless a report says otherwise)

| | |
|---|---|
| App | Aurelle guest web app (demo) at `http://localhost:4300`, started with the bug switched on, e.g. `npx cross-env BUG_MODE=1 npm run app` (or `npm run app:bugs` for all six) |
| Browsers | Chrome 154 and Firefox 157 on Windows 11 (desktop, 1366×900); headless Chrome on Ubuntu in CI |
| Time zone | Computer set to Eastern Time (America/Toronto). CI uses the same time zone. |
| Account | Any guest; sign in with the one-time code from the dev inbox panel |

---

## AUR-1

**In-room dining: service charge is calculated on subtotal + tax, overcharging every order**

| | |
|---|---|
| Area | In-room dining, cart totals (the same calculation is used by the web app and the orders API) |
| Severity / Priority | Major / P1 |
| Frequency | Always, at every property |
| Switch | `BUG_MODE=1` |

**Steps to reproduce**
1. Sign in and open **Aurelle Toronto → In-room dining**.
2. Add **2 × Club sandwich** ($32.00 each) and **1 × Chocolate fondant** ($16.00).
3. Read the totals under **Your order**.

**Expected** (house rule: tax and service charge are each calculated on the food subtotal)

| Subtotal | Tax (13%) | Service charge (18%) | Total |
|---|---|---|---|
| $80.00 | $10.40 | **$14.40** | **$104.80** |

**Actual**

| Subtotal | Tax (13%) | Service charge (18%) | Total |
|---|---|---|---|
| $80.00 | $10.40 | **$16.27** | **$106.67** |

The service charge is 18% of $90.40 (subtotal + tax). The guest is overcharged $1.87 on this order,
and the order saved by the API stores the same wrong total.

**Caught by** `tests/web/specs/dining.spec.ts` → *calculates the in-room dining bill at …*, failing for
all 5 properties, e.g. Toronto:
```
Expect $(`[data-testid="cart-service"]`) to have attribute data-amount
Expected: "1440"
Received: "1627"
```

**Notes.** The menu promises a service charge on the food bill, so every guest pays a little more
than advertised, which leads to complaints and refunds. Look at `diningTotals()` in
`app/shared/pricing.ts`: the service charge base includes `tax`.

---

## AUR-2

**Booking: guest can check out on the check-in date, creating a 0-night booking for 0.00**

| | |
|---|---|
| Area | Room booking, date picker and `POST /api/bookings` validation |
| Severity / Priority | Critical / P1 |
| Frequency | Always |
| Switch | `BUG_MODE=2` |

**Steps to reproduce**
1. Sign in and open **Aurelle Paris → Book a room**, choose **Deluxe King**.
2. Open **Check-in** and pick any future date, e.g. 21 October 2026.
3. Open **Check-out**.

**Expected.** 21 October is disabled in the check-out calendar (a stay is at least one night); the
first selectable day is 22 October. The API rejects such a stay with `400` and
`checkOutNotAfterCheckIn`.

**Actual.** 21 October can be selected. The price summary shows **0 nights** and a **total of €0.00**,
and **Book now** creates the booking. Through the API:
```
POST /api/bookings  {"propertyId":"paris","checkIn":"2026-10-21","checkOut":"2026-10-21",...}
201 Created  {"reference":"AUR-HR52AZ", "checkInAt":"2026-10-21T13:00:00.000Z",
              "checkOutAt":"2026-10-21T10:00:00.000Z", "pricing":{"nights":0,"total":0,...}}
```
The check-out time is three hours *before* the check-in time.

**Caught by**
- `tests/web/specs/booking.spec.ts` → *does not allow check-out on the check-in date*
  ```
  Expect $(`[data-testid="checkout-day-2026-10-21"]`) to be disabled
  Expected: "disabled"   Received: "not disabled"
  ```
- `tests/web/specs/api.spec.ts` → *rejects invalid stay dates with a 400 and the reason*
  (`Expected: 400, Received: 201`)

**Notes.** Critical because the server accepts it too, so a room is held for free and inventory
reports count a stay that can't exist. The rule lives in `app/shared/stay-rules.ts`
(`minimumNights()`), shared by the form and the API.

---

## AUR-3

**Booking confirmation: check-in and check-out are shown in the guest's time zone, not the hotel's**

| | |
|---|---|
| Area | Booking confirmation page |
| Severity / Priority | Major / P1 |
| Frequency | Always, when the guest's computer is in a different time zone from the hotel |
| Switch | `BUG_MODE=3` |

**Steps to reproduce**
1. With the computer in Eastern Time, sign in and book **Aurelle Tokyo**, **25 to 27 November 2026**.
2. Read **Check-in** and **Check-out** on the confirmation page. The page says
   *"Dates and times are shown in Tokyo local time."*

**Expected**
- Check-in: **Wednesday, November 25, 2026 at 3:00 PM**
- Check-out: **Friday, November 27, 2026 at 12:00 PM**

**Actual**
- Check-in: Wednesday, November 25, 2026 at **1:00 AM**
- Check-out: **Thursday, November 26**, 2026 at **10:00 PM** (a day early)

A guest reading this would plan to leave a day early. Paris, Dubai and Maui show wrong times too.
Toronto looks correct only because the computer is also in Toronto.

**Caught by** `tests/web/specs/booking.spec.ts` → *shows check-in and check-out in local time at …*,
failing for Paris, Tokyo, Dubai and Maui, e.g. Tokyo:
```
Expect $(`[data-testid="confirmation-checkin"]`) to have attribute data-local-time
Expected: "15:00"
Received: "01:00"
```

**Notes.** The API stores the right instant (`checkInAt: 2026-11-25T06:00:00.000Z`); only the display
is wrong. `stayDateTime()` in `app/web/src/format.ts` formats the date without the property's
`timeZone`. This is why the suite runs with a fixed browser time zone and covers hotels on both sides of UTC.

---

## AUR-4

**French: the booking confirmation title shows the raw translation key `booking.confirm.title`**

| | |
|---|---|
| Area | Localization (French), booking confirmation page |
| Severity / Priority | Minor / P2 |
| Frequency | Always, in French |
| Switch | `BUG_MODE=4` |

**Steps to reproduce**
1. Sign in, choose **Français** in the language menu.
2. Book any stay (or open an existing booking's confirmation).

**Expected.** The page title reads **"Votre séjour est confirmé"**.

**Actual.** The page title reads **`booking.confirm.title`**. The rest of the page is translated.

**Caught by** `tests/web/specs/localization.spec.ts`:
- *fr: the booking confirmation is translated*
  ```
  Expect $(`[data-testid="confirmation-title"]`) to have text
  Expected: "Votre séjour est confirmé"
  Received: "booking.confirm.title"
  ```
- *fr: key screens show no raw translation keys* (lists the screen and the key)

**Notes.** Low functional impact, but it is the first thing a French-speaking guest sees after paying,
so it hurts trust. English and Japanese are not affected.

---

## AUR-5

**In-room dining: double-clicking "Place order" creates two orders**

| | |
|---|---|
| Area | In-room dining, placing an order |
| Severity / Priority | Major / P1 |
| Frequency | Always, when the second click lands before the kitchen system confirms the first (about 0.4 s) |
| Switch | `BUG_MODE=5` |

**Steps to reproduce**
1. Sign in and open **Aurelle Tokyo → In-room dining**.
2. Add **1 × Club sandwich**.
3. Double-click **Place order**.
4. Check the guest's orders (`GET /api/orders`, or the kitchen view).

**Expected.** One order. After the first click the button is disabled and reads *"Placing order…"*;
a repeated request with the same idempotency key returns the existing order.

**Actual.** Two orders with different order numbers are saved. The guest only sees one of them, but
the kitchen would prepare, and charge for, both.

**Caught by** `tests/web/specs/dining.spec.ts` → *creates only one order when Place order is double-clicked*
```
expect(received).toHaveLength(expected)
Expected length: 1
Received length: 2
```

**Notes.** Guests double-tap all the time, especially on slow hotel Wi-Fi. The fix needs both layers:
ignore the second click in the app, and reuse the cart's idempotency key so the server deduplicates
(the API test *treats a repeated order with the same idempotency key as one order* covers the server).

---

## AUR-6

**Sign-in: the code field accepts only 5 digits, but the emailed code has 6, so no guest can sign in**

| | |
|---|---|
| Area | Sign-in with a one-time code |
| Severity / Priority | Blocker / P1 |
| Frequency | Always |
| Switch | `BUG_MODE=6` |

**Steps to reproduce**
1. Open **Sign in**, enter any email, click **Send code**.
2. The dev inbox panel shows the code, e.g. **486105** (6 digits).
3. Type the code into **One-time code** and click **Sign in**.

**Expected.** The field accepts all 6 digits and the guest is signed in.

**Actual.** The field stops at 5 digits (**48610**). Clicking **Sign in** shows *"That code is
incorrect."* The guest can never sign in on the web.

**Caught by** `tests/web/specs/sign-in.spec.ts`:
- *signs in with the emailed one-time code* (`@smoke`)
  ```
  Expect $(`[data-testid="signin-code"]`) to have property value
  Expected: "486105"
  Received: "48610"
  ```
- *keeps the guest signed in after a reload* (same symptom)
- *rejects an expired code*: shows *"That code is incorrect."* instead of the expired-code message,
  because the truncated code never matches

**Notes.** A smoke test catches this, so it would stop a deploy within about a minute. Suggestion:
take the field length from the server (`codeLength` in the `POST /api/auth/request-code` response)
instead of a number in the client, and check the other clients (iOS, Android) for the same assumption.
