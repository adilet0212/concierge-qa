# Answers

**Spoilers.** Try each exercise first. Every entry has: the bug, the root cause, the fix, the test
that catches it, and a short "say it out loud" script for practising your explanation.
Fixed code lives in [`solutions/`](solutions) under the same path as the exercise.

- [JavaScript](#javascript)
- [TypeScript reading](#typescript-reading)
- [WebdriverIO test code](#webdriverio-test-code)
- [Interview simulations](#interview-simulations)
- [Mock rounds](#mock-rounds)

---

## JavaScript

### js-01 · Menu labels: `map` callback missing `return`
- **Bug:** the arrow function passed to `map` has a `{ block }` body and never returns, so every label is `undefined`.
- **Root cause:** only a *concise* arrow body (`x => expr`) returns implicitly. With braces, the template literal is evaluated and thrown away.
- **Fix:** `return \`${dish.name} · $${price}\`;`
- **Test that catches it:** "builds one label per dish" expects two labels and receives `[undefined, undefined]`.
- **Say it out loud:** "The intent is one label per dish. Tracing the first dish, `price` is `'24.00'`, then the template string is built, but nothing returns it, because the callback has curly braces. With braces an arrow function needs an explicit `return`, so map collects `undefined`. I'll add `return`, and the existing test with two dishes proves it."

### js-02 · Cheapest rate: `sort()` without a comparator
- **Bug:** `rates.sort()` sorts numbers as strings: `[450, 95, 1200, 300]` becomes `[1200, 300, 450, 95]`, so `1200` is returned.
- **Root cause:** the default comparator converts elements to strings and compares them by UTF-16 code units.
- **Fix:** `rates.sort((a, b) => a - b)`, or simply `Math.min(...rates)`.
- **Test that catches it:** "returns the lowest rate" (expects 95, gets 1200) and the different-digit-length test.
- **Say it out loud:** "We want the smallest rate. `sort()` with no comparator sorts lexicographically, as strings, so `'1200'` comes before `'95'` because `'1'` is less than `'9'`. I'll pass `(a, b) => a - b`, or use `Math.min`, which is clearer. The key test case is rates with different numbers of digits."

### js-03 · Find an available room: early `return` inside the loop
- **Bug:** `return null` is inside the `for` loop, so only the first room is ever checked. An empty list returns `undefined`.
- **Root cause:** the "not found" return belongs after the loop has checked every room.
- **Fix:** move `return null;` below the loop.
- **Test that catches it:** the match is the third room (expects room 1203, gets `null`), and the empty-list test (expects `null`, gets `undefined`).
- **Say it out loud:** "The function should look through all rooms. On the first iteration, room 1201 is a suite but not available, so the `if` fails and we immediately hit `return null`. The loop never reaches 1203. The 'not found' answer should only be given after the loop, which also fixes the empty-list case returning undefined."

### js-04 · Request ETA: `switch` fall-through
- **Bug:** `case 'towels'` has no `break`, so it falls through into `'pillows'` and returns 15 instead of 10.
- **Root cause:** in a `switch`, execution continues into the next `case` until a `break` or `return`.
- **Fix:** add `break;` after `minutes = 10;` (or `return` directly from each case).
- **Test that catches it:** `towels -> 10 minutes` gets 15.
- **Say it out loud:** "For 'towels' we set minutes to 10, but there's no `break`, so JavaScript falls through into the 'pillows' case and overwrites it with 15. I'll add the missing break. ESLint's `no-fallthrough` rule would catch this too."

### js-05 · Guest greeting: reading a property of `undefined`
- **Bug:** `guest.profile.preferredName` throws `TypeError` when the guest has no `profile`.
- **Root cause:** the code assumes `profile` always exists; front-desk guests don't have one.
- **Fix:** `guest.profile?.preferredName || guest.firstName`
- **Test that catches it:** "works for guests created at the front desk" throws `Cannot read properties of undefined`.
- **Say it out loud:** "The spec has three guest shapes, and the third has no profile at all. Then `guest.profile` is undefined, and reading `.preferredName` from undefined throws. Optional chaining returns undefined instead of throwing, and the `||` falls back to the first name."

### js-06 · Arrival date label: `Date` months are 0-based
- **Bug:** `new Date(year, month, day)` with `month = 3` from `'2026-03-15'` creates **April** 15th.
- **Root cause:** the `Date` constructor's month is 0-based (0 = January), but ISO months are 1-based.
- **Fix:** `new Date(year, month - 1, day)`.
- **Test that catches it:** expects `'Sun, 15 Mar 2026'`, gets `'Wed, 15 Apr 2026'`; `'2026-12-31'` overflows into January 2027.
- **Say it out loud:** "Splitting '2026-03-15' gives month 3. But the Date constructor counts months from zero, so 3 means April, which shifts both the month name and the weekday. I'll subtract one. A good test is December 31st, which with this bug rolls into the next year."

### js-07 · Stay search from the URL: string + number
- **Bug:** `URLSearchParams.get()` returns strings, so `'2' + '1'` is `'21'`, and `'2' + 0` is `'20'`.
- **Root cause:** `+` concatenates when either side is a string; query-string values are always strings.
- **Fix:** convert with `Number(params.get('adults') ?? 1)` (same for the others).
- **Test that catches it:** expects `{ adults: 2, ..., totalGuests: 3 }`, gets strings and `'21'`.
- **Say it out loud:** "Everything from a URL is a string. So `adults` is `'2'`, `children` is `'1'`, and `+` joins them into `'21'`. The defaults are numbers, which is why some cases look fine. I'll convert each value with `Number()` right where it's read, so the rest of the code only sees numbers."

### js-08 · Nightly charges: off-by-one in the loop
- **Bug:** `night <= nights` runs `nights + 1` times, so a 3-night stay gets 4 charges.
- **Root cause:** counting from 0, the last valid index is `nights - 1`.
- **Fix:** `night < nights`.
- **Test that catches it:** "creates one dated charge per night" gets four charges; the folio total is one night too high.
- **Say it out loud:** "Three nights should give the 10th, 11th and 12th. The loop starts at 0 and runs while `night <= 3`, so 0, 1, 2 and 3: four iterations. That's a classic off-by-one; it should be `<`. This is a billing bug: the guest would be charged for an extra night."

### js-09 · Confirm a booking: missing `await`
- **Bug:** `api.getBooking()` is not awaited, so `booking` is a Promise and `booking.status` is `undefined`. Every booking is rejected.
- **Root cause:** calling an async function returns a promise immediately; you need `await` to get the value.
- **Fix:** `const booking = await api.getBooking(bookingId);`
- **Test that catches it:** the pending booking is rejected with "status: undefined"; the cancelled-booking message is wrong too.
- **Say it out loud:** "`getBooking` returns a promise, and there's no `await`, so `booking` is the promise object. A promise has no `status` property, so the check `!== 'pending'` is always true and we throw with 'status: undefined'. Adding `await` fixes it. The `wdio/await` and `@typescript-eslint/no-floating-promises` style lint rules catch this class of bug."

### js-10 · Room numbers: `map(parseInt)`
- **Bug:** `map` calls `parseInt(value, index)`, so the index is used as the radix: `parseInt(' 1207', 1)` is `NaN`, `parseInt('1301', 2)` is `1`.
- **Root cause:** `parseInt` takes a second `radix` argument, and `map` passes the index as the second argument.
- **Fix:** `.map((part) => Number.parseInt(part, 10))` (or `.map((part) => Number(part.trim()))`).
- **Test that catches it:** expects `[1204, 1207, 1301]`, gets `[1204, NaN, 1]`.
- **Say it out loud:** "Passing `parseInt` directly to `map` looks fine, but `map` calls it with value, index and array. `parseInt` reads the index as the radix: index 1 is an invalid radix so we get NaN, and index 2 means binary, so '1301' parses as 1. I'll wrap it in an arrow function with radix 10."

### js-11 · Allergy flags: `indexOf` truthiness
- **Bug:** `indexOf(...) ? true : false` returns `false` when the allergen is the **first** item (index 0) and `true` when it is missing (-1).
- **Root cause:** `indexOf` returns a position, not a boolean; 0 is falsy and -1 is truthy.
- **Fix:** `return dish.allergens.includes(allergen);`
- **Test that catches it:** `hasAllergen(padThai, 'peanuts')` is `false`; `'gluten'` is `true`; the flagged list includes the fruit plate.
- **Say it out loud:** "For Pad thai, peanuts is at index 0, which is falsy, so we say 'no peanuts': exactly backwards, and for an allergy feature that's a safety issue. Missing items return -1, which is truthy. `includes()` returns a real boolean. I'd also add a test where the allergen is the first in the list."

### js-12 · Booking reference: regex without anchors
- **Bug:** `/AUR-[A-Z0-9]{6}/` matches anywhere in the string, so `'AUR-4F7K2Q9'` and `'XAUR-4F7K2Q'` are accepted.
- **Root cause:** without `^` and `$`, `test()` only needs to find the pattern *somewhere*.
- **Fix:** `/^AUR-[A-Z0-9]{6}$/`.
- **Test that catches it:** the "rejects" cases with extra characters return `true`.
- **Say it out loud:** "The regex has no start or end anchor, so it's a 'contains' check. Seven characters still contains six valid ones, and an extra prefix is ignored. Adding `^` and `$` forces the whole string to match. I'd test strings that are too long, too short and have a prefix."

### js-13 · Top-rated rooms: `sort()` mutates the input
- **Bug:** `rooms.sort(...)` reorders the caller's array, so the full room list further down the page is now sorted by rating.
- **Root cause:** `Array.prototype.sort` sorts **in place** and returns the same array.
- **Fix:** `[...rooms].sort(...)` (or `rooms.toSorted(...)`).
- **Test that catches it:** "keeps the full room list in the order the hotel chose".
- **Say it out loud:** "The top-2 result is correct, but `sort` works in place, so the original array passed in gets reordered too. Any other part of the page using that array now shows it sorted. Copying first, with spread or `toSorted`, keeps the function pure."

### js-14 · Group bookings: shallow copy shares nested arrays
- **Bug:** `{ ...template }` copies the top level only; `booking.extras` is the **same array** as `template.extras`, so `push` changes the template and every later booking.
- **Root cause:** object spread is a shallow copy; nested objects and arrays are copied by reference.
- **Fix:** build a new array: `extras: [...template.extras, ...extraRequests]` (or `structuredClone(template)`).
- **Test that catches it:** booking B gets booking A's `'crib'`; the template changes.
- **Say it out loud:** "The spread looks like a copy, but it's shallow: `extras` still points to the template's array. Pushing 'crib' into it adds 'crib' to the template, so the next guest inherits it. I'll create a new extras array for each booking. A test that creates two bookings from one template shows the leak."

### js-15 · Wake-up calls: `var` in a loop closure
- **Bug:** every callback reads `roomNumbers[i]` with `i === 3` (the final value), so all messages say "room undefined".
- **Root cause:** `var` is function-scoped: there's one `i` shared by all callbacks, and they run after the loop finished.
- **Fix:** `for (let i = 0; ...)`: `let` creates a new binding per iteration.
- **Test that catches it:** the messages contain `undefined` instead of the room numbers.
- **Say it out loud:** "The callbacks run later, after the loop. With `var` there's only one `i` for the whole function, and by then it's 3, past the end of the array. Using `let` gives each iteration its own `i`, so each callback remembers its room."

### js-16 · Concierge queue: lost `this`
- **Bug:** `requests.forEach(this.add)` passes the method without its object, so inside `add`, `this` is `undefined` and `this.requests` throws.
- **Root cause:** `this` is decided by how a function is called; a detached method called as a plain function has no `this` (strict mode in modules/classes).
- **Fix:** `requests.forEach((request) => this.add(request));` (arrow functions keep the outer `this`), or `forEach(this.add, this)` / `this.add.bind(this)`.
- **Test that catches it:** "adds several requests at once" throws `Cannot read properties of undefined (reading 'requests')`.
- **Say it out loud:** "`add` works when called as `queue.add()`, but `forEach(this.add)` just passes the function. When forEach calls it, there's no object before the dot, so `this` is undefined. An arrow function wrapper calls it as `this.add(...)`, keeping the right `this`."

### js-17 · Room status filter: `==` type coercion
- **Bug:** choosing "vacant" (`0`) shows every room, because `0 == ''` is `true`.
- **Root cause:** loose equality converts types: `''` becomes `0`, so the "All rooms" branch matches.
- **Fix:** `statusFilter === '' || room.status === statusFilter`.
- **Test that catches it:** "shows only vacant rooms" returns all four rooms.
- **Say it out loud:** "The filter value 0 means vacant, and empty string means 'all'. With double equals, JavaScript converts the empty string to a number, which is 0, so `0 == ''` is true and every room passes. Strict equality compares type and value, so 0 no longer equals the empty string."

### js-18 · In-room dining bill: floating-point money
- **Bug:** `24.4 + 6.2` is `30.599999999999998` and the tax isn't rounded, so the receipt shows values like `3.978` and doesn't add up.
- **Root cause:** decimal fractions like 0.1 can't be represented exactly in binary floating point.
- **Fix:** convert to integer cents (`Math.round(price * 100)`), calculate, round the tax once, convert back at the end (or keep cents everywhere).
- **Test that catches it:** expects `{ subtotal: 30.6, tax: 3.98, total: 34.58 }`; gets float noise.
- **Say it out loud:** "Money in floating point is a classic bug: 24.40 plus 6.20 is not exactly 30.60 in binary. And the tax is never rounded to the cent, so it's 3.978. I'd do the maths in integer cents, round the tax once, and only convert to dollars for display. The Aurelle app stores every price in minor units for this reason."

### js-19 · Checkout reminders: `async` callback inside `forEach`
- **Bug:** the function returns `{ sent: 0 }` immediately, before any email is sent.
- **Root cause:** `forEach` ignores the promise returned by an `async` callback, so nothing waits for the emails.
- **Fix:** `for (const guest of guests) { await sendEmail(...); sent += 1; }`, or `await Promise.all(guests.map(...))` to send in parallel.
- **Test that catches it:** expects `{ sent: 3 }` and 3 delivered emails; gets 0 and 0.
- **Say it out loud:** "Each callback is async, so forEach starts all three and gets back promises, which it throws away. The function hits `return` straight away with sent still 0. Using for...of with await waits for each email; Promise.all with map would send them in parallel and still wait."

### js-20 · Property loader: promise not returned
- **Bug:** the inner `fetchJson(... /rooms)` promise is not returned, so the outer promise resolves with the property **before** `rooms` is set, and a failed rooms request becomes an unhandled rejection.
- **Root cause:** inside `.then`, you must `return` a promise for the chain to wait for it and pass its errors on.
- **Fix:** `return fetchJson(roomsUrl).then((rooms) => ({ ...property, rooms }))`, or rewrite with `async`/`await`.
- **Test that catches it:** `rooms` is missing from the result; the 503 case resolves instead of rejecting (Vitest also reports the unhandled rejection).
- **Say it out loud:** "The second fetch is started but not returned, so the outer `then` returns the property immediately, and rooms are attached later, too late. Worse, if the rooms call fails, nobody is listening, so the screen never shows an error. Returning the inner promise, or using async/await, keeps it in one chain."

### js-21 · Rates comparison: results pushed in completion order
- **Bug:** `rates.push()` inside the parallel callbacks stores rates in the order the requests **finish** (Paris, Tokyo, Toronto), then they're matched to ids by position.
- **Root cause:** concurrent operations complete in any order; only `Promise.all`'s returned array keeps the input order.
- **Fix:** `const rates = await Promise.all(propertyIds.map((id) => fetchRate(id)));`
- **Test that catches it:** Toronto shows Paris's rate, and so on.
- **Say it out loud:** "Everything runs in parallel, which is right, but each callback pushes when it finishes. Paris answers first, so its rate lands at index 0, which is Toronto's slot. Promise.all already returns results in input order, so I'll use its return value instead of pushing. I'd test with deliberately different delays."

### js-22 · Hotel local date: re-parsing a zoned string as local time
- **Bug:** `new Date(now.toLocaleString('en-US', { timeZone }))` creates a Date whose *local* wall-clock time equals the hotel's, and then `toISOString()` converts it to **UTC**, shifting the date by the phone's offset. For 9 pm in Tokyo on a Toronto phone it returns the next day.
- **Root cause:** a `Date` is an instant with no time zone; mixing "hotel wall-clock", "phone local" and "UTC" in one value gives wrong dates near midnight.
- **Fix:** ask `Intl.DateTimeFormat` for the year/month/day parts **in the hotel's zone** (`formatToParts`) and build `YYYY-MM-DD` from them.
- **Test that catches it:** `2026-03-15T12:00:00Z` in Tokyo gives `2026-03-16`; the voucher check fails.
- **Say it out loud:** "Tokyo time is 9 pm on the 15th. `toLocaleString` gives the string '3/15/2026, 9:00 PM', but `new Date` parses it as Toronto time, and `toISOString` converts that to UTC, 1 am on the 16th. So it works for morning times and breaks in the evening. I'd use Intl with the hotel's timeZone to get the date parts directly. The test needs instants close to midnight in different zones."

---

## TypeScript reading

### ts-01 · Room availability: types fine, logic wrong
- **Bug:** `a.checkIn <= b.checkOut || b.checkIn <= a.checkOut` is true for almost any pair of stays, and `<=` also makes back-to-back stays clash.
- **Root cause:** two ranges overlap only when **each** starts before the other ends (`&&`). Checkout day is not a night, so the comparison must be strict.
- **Fix:** `return a.checkIn < b.checkOut && b.checkIn < a.checkOut;`
- **Test that catches it:** "well before" and both back-to-back cases are reported as not free.
- **Say it out loud:** "The types are all correct, which is why the compiler is happy, but the logic is wrong. With `||`, a stay in early May 'overlaps' one in mid May just because it starts before the other ends. The standard overlap check is: A starts before B ends AND B starts before A ends, with strict less-than because guests can check in on someone's checkout day."

### ts-02 · Booking summary: `as` hides a wrong type
- **Bug:** `(await response.json()) as BookingSummary` tells TypeScript `roomTotal` is a number, but the API sends `"1350.00"`. So `roomTotal + 45` is `"1350.0045"`.
- **Root cause:** `as` is a compile-time assertion only. It doesn't convert or validate anything; `response.json()` returns `any`.
- **Fix:** type the raw response truthfully (`roomTotal: string`) and convert at the boundary: `{ ...body, roomTotal: Number(body.roomTotal) }` (or validate with a schema library).
- **Test that catches it:** expects 1395, gets `'1350.0045'`; `typeof roomTotal` is `'string'`.
- **Say it out loud:** "TypeScript only knows what we tell it. `as BookingSummary` *claims* roomTotal is a number, but at runtime it's still the string from the JSON, so `+` concatenates. Casting API data is where type safety quietly ends. I'd model the real response with strings and convert once when the data enters the app."

### ts-03 · Suggested tip: `||` vs `??`
- **Bug:** a guest who chose **0%** is charged the 15% default, because `0 || 15` is `15`.
- **Root cause:** `||` falls back on any falsy value (0, '', false); "skipped" really means `undefined`.
- **Fix:** `order.tipPercent ?? DEFAULT_TIP_PERCENT`.
- **Test that catches it:** "respects a guest who chose not to tip" expects 0, gets 600.
- **Say it out loud:** "The optional field is undefined when the guest skipped the step, but 0 is a valid choice. The `||` operator treats 0 as falsy, so it applies the default and the guest gets charged a tip they declined. Nullish coalescing, `??`, only replaces null or undefined."

---

## WebdriverIO test code

### wdio-01 · Cart quantity: missing `await` on an action and an assertion
- **Bug:** neither `.click()` nor `expect(...).toHaveText()` is awaited. The test ends immediately, so it passes even when the cart is broken.
- **Root cause:** WebdriverIO commands and `expect-webdriverio` matchers return promises. An un-awaited assertion is a promise nobody checks; its failure (if any) happens after the test is already marked passed.
- **Fix:** `await $(...).click();` and `await expect($(...)).toHaveText('1');`
- **How to prove it:** temporarily change the expected text to `'99'`. The buggy test still passes; the fixed one fails.
- **Prevention:** the ESLint rule `wdio/await-expect` and `@typescript-eslint/no-floating-promises` (this repo enables `wdio/await-expect`).
- **Say it out loud:** "Every WebdriverIO command is async. Here the click and the expect aren't awaited, so the test function returns straight away and Mocha marks it green. The assertion would run later, if at all. A test that can't fail is worse than no test. I'd add the awaits and turn on the await-expect lint rule."

### wdio-02 · Order status: `browser.pause` instead of a real wait
- **Bug:** a fixed 5-second pause, then a one-off `getText()`. It's slow on fast machines and still flaky on slow ones (5 s might not be enough, giving `""`).
- **Root cause:** a hard sleep guesses how long the app needs; the app's real timing varies.
- **Fix:** `await expect($('[data-testid="order-status"]')).toHaveText('Received');`: the matcher retries until the text matches or `waitforTimeout` expires.
- **Prevention:** `wdio/no-pause` lint rule (enabled in this repo).
- **Say it out loud:** "`browser.pause` waits a fixed time whether the page needs it or not, so the test is always 5 seconds slower, and if CI is slower than that, it still fails. WebdriverIO's expect matchers auto-wait and retry, so the test continues the moment the status appears. I'd replace pause plus getText with toHaveText."

### wdio-03 · Sign-in code step: wrong and fragile selectors
- **Bug:** `[data-testid="signin-code-input"]` doesn't exist (the real id is `signin-code`), so the test fails although the feature works. Also: `form input` depends on DOM structure, and `button*=Send` depends on English text.
- **Root cause:** selectors were guessed or copied instead of checked against the DOM, and they're coupled to layout and language.
- **Fix:** use the app's test ids: `signin-email`, `signin-request-code`, `signin-code`.
- **Test that catches it:** the runnable spec fails with "element wasn't found"; the solution passes.
- **Say it out loud:** "The failure says the element wasn't found, so first I inspect the page: the code field's test id is `signin-code`, not `signin-code-input`. The other selectors work today but break if someone wraps the input in another div or when we run in French. Dedicated data-testid attributes are a contract between developers and QA, so they're the most stable choice."

### wdio-04 · Mobile menu: `isExisting` vs `isDisplayed`
- **Bug:** the test asserts the hamburger button doesn't **exist**, but it's always in the DOM; CSS hides it on wide screens.
- **Root cause:** `isExisting()` checks the DOM; `isDisplayed()` checks whether the user can see it. The requirement is about visibility.
- **Fix:** `await expect($('[data-testid="menu-toggle"]')).not.toBeDisplayed();`
- **Test that catches it:** runnable; the buggy version fails on desktop, the solution passes.
- **Say it out loud:** "The requirement is 'the guest doesn't see the button', but the test asks 'is it in the HTML?'. Responsive layouts often keep elements in the DOM and hide them with CSS, so isExisting is true. The fix is to assert on visibility with `not.toBeDisplayed()`, which also auto-waits."

### wdio-05 · Confirmation heading: asserting on the element, not its text
- **Bug:** `expect(heading).toEqual('Your stay is confirmed')` compares a WebdriverIO **element object** to a string.
- **Root cause:** `$()` returns an element reference; the text has to be read (`getText()`) or checked with a WebdriverIO matcher.
- **Fix:** `await expect($('[data-testid="confirmation-title"]')).toHaveText('Your stay is confirmed');`
- **Test that catches it:** runnable; fails with "Expected: 'Your stay is confirmed', Received: { elementId ... }".
- **Say it out loud:** "The screenshot shows the right heading, so the app is fine and the assertion is wrong. It compares the element object itself to a string, which can never be equal. `toHaveText` reads the element's text and retries until it matches, so it's both correct and robust."

### wdio-06 · Booking journey: tests depend on each other
- **Bug:** tests 2 and 3 rely on the browser state left by the previous test (signed in, on the right page). One failure cascades; running or retrying a single test fails. It also uses a fixed email shared across runs.
- **Root cause:** test order is treated as setup. Each test must arrange its own preconditions.
- **Fix:** every test starts from a known state: create a unique guest through the API, put the session in the browser, open the right URL (`openAsNewGuest('/properties/tokyo')`). Only the sign-in test uses the sign-in UI.
- **Say it out loud:** "These three tests are really one test split in three. The second assumes the first left us signed in on the home page, so if the first fails, everything after it fails, and a retry of test 3 starts in a blank browser. I'd make each test independent: sign in through the API, which is fast, and deep-link to the page under test. Then tests can run alone, in any order, and in parallel."

### wdio-07 · Order history: shared data and a global reset in a parallel suite
- **Bug 1:** a hard-coded guest email shared with other spec files: orders placed by another worker for the same guest make the count 2.
- **Bug 2:** `resetAllData()` in `beforeEach` wipes the **whole server** while four other workers are mid-test, deleting their sessions and bookings (their `401`s and "not found" errors).
- **Root cause:** tests running in parallel share one backend, so any shared or global state becomes a race condition.
- **Fix:** a unique guest per test (`uniqueEmail()`), and no global reset inside tests (reset once before the whole run, as this repo's `onPrepare` does, or not at all).
- **Say it out loud:** "Alone it passes; in parallel it's flaky, so I look for shared state. Two things are shared: the guest email, so someone else's order shows up in 'my' history, and the reset, which deletes every other worker's data mid-test. That second one is why unrelated tests fail. Each test should create its own unique data and never reset global state."

### wdio-08 · Order tracking page object: missing `return` in a getter and in `waitUntil`
- **Bug 1:** `get status() { $('...'); }` has a block body without `return`, so `this.status` is `undefined` and `getText` throws.
- **Bug 2:** the `waitUntil` condition `async () => { (await ...) === expected; }` also has a block body without `return`, so it always resolves `undefined` (falsy) and waits for the full timeout.
- **Root cause:** the same JavaScript rule twice: braces mean you need an explicit `return`.
- **Fix:** `return $('[data-testid="order-status"]');` and `async () => (await this.status.getText()) === expected`. (Even simpler: `await expect(this.status).toHaveText(expected, { wait: 8000 })`.)
- **Say it out loud:** "The first failure is 'cannot read getText of undefined', so I check the getter: it computes the element but doesn't return it. After fixing that, the test times out, which means the waitUntil condition is never truthy, and again it's a block body with no return. waitUntil needs the callback to return true. I'd also mention that toHaveText does this waiting for us."

---

## Interview simulations

### sim-01 · Dining cart (3 bugs)
1. **`add` overwrites instead of increasing.** `line.quantity = quantity` → `line.quantity += quantity`. *Test:* "increases the quantity when the same dish is added again" (expects 3, gets 2).
2. **`remove` of a missing item deletes the last line.** `findIndex` returns -1 and `splice(-1, 1)` removes the last element. Guard with `if (index === -1) return;`. *Test:* "does nothing when removing a dish that is not in the cart".
3. **Service charge calculated on subtotal + tax.** Should be `Math.round(subtotal * this.serviceChargeRate)`. *Test:* totals expect service 900 (gets 1017). This is the same class of bug as the Aurelle app's seeded bug #1.
- **Say it out loud:** "I'll walk through the example: add club sandwich twice, so quantity should be 2, but the second add sets quantity to 1 instead of adding. Then remove: findIndex gives -1 for a missing dish, and splice with -1 counts from the end, so we silently delete the last line. Finally the totals: the spec says service is on the food subtotal, but the code adds tax first, so the guest pays service on tax. I'd add a test for each rule."

### sim-02 · Stay validator (3 bugs)
1. **Daylight saving breaks `nightsBetween`.** Local midnights on 2026-03-07 and 2026-03-09 (Toronto) are 47 hours apart, so `Math.floor(47/24)` is 1. Use UTC dates (`Date.parse(\`${d}T00:00:00Z\`)`) and/or `Math.round`. *Test:* "counts nights across the spring daylight-saving change".
2. **Same-day stays are accepted.** `nights < 0` should be `nights < 1`. *Test:* "rejects check-out on the same day as check-in".
3. **A full room is rejected.** `>= room.maxGuests` should be `> room.maxGuests`. *Test:* "accepts a normal stay that fills the room exactly".
- **Say it out loud:** "Two of these are boundary mistakes: zero nights passes because the check is `< 0` instead of `< 1`, and exactly two guests in a room for two fails because of `>=`. The third is subtler: the dates are parsed as local midnight, and on the night clocks spring forward there are only 23 hours between midnights, so dividing by 24 and flooring loses a night. Using UTC avoids DST entirely."

### sim-03 · API client with retries (3 bugs)
1. **Too few attempts.** `for (attempt = 1; attempt < retries; ...)` runs `retries - 1` times (once with the default). Should be `attempt <= retries + 1`. *Tests:* "retries server errors and succeeds on the third attempt", "gives up after the first try plus two retries".
2. **4xx returned as data instead of thrown.** Throw `new ApiError(response.status, problem.error)`, **and** make the `catch` rethrow non-retryable errors (`if (error instanceof ApiError && error.status < 500) throw error;`), otherwise the catch would swallow and retry it. *Test:* "does not retry a 404 and rejects with the server message".
3. **`Authorization: Bearer null` when signed out.** Only add the header when `getToken()` returns a token. *Test:* "sends no Authorization header when the guest is signed out".
- **Say it out loud:** "With retries = 2 the spec says up to three attempts, but the loop runs from 1 while less than 2: a single attempt. Then a 404 is returned as a normal value, so callers think it succeeded; it should throw ApiError, and I have to be careful the catch block doesn't catch and retry my own 4xx error. Last, a signed-out guest sends 'Bearer null', which many servers reject. Each rule in the spec maps to one test."

---

## Mock rounds

### r1-a · Late checkout fee: `&&` instead of `||`
- **Bug:** `guest.tier === 'gold' && guest.tier === 'platinum'` can never be true, so elite members are charged.
- **Fix:** `||`. **Test:** gold at 13:00 and platinum at 15:00 should pay 0.
- **Say it out loud:** "One variable can't equal two different values at the same time, so this condition is always false. The spec says gold *or* platinum, so it should be `||`. I'd test each tier."

### r1-b · Loyalty points: `parseInt` on a formatted number, and `>` vs `>=`
- **Bug 1:** `parseInt('1,250.75')` stops at the comma and returns 1. Remove separators first: `Math.floor(Number(s.replaceAll(',', '')))`.
- **Bug 2:** "3 nights or more" is `>= 3`, not `> 3`.
- **Test:** `'1,250.75'` over 3 nights should be 13000 (gets 10).
- **Say it out loud:** "parseInt reads digits until the first character it doesn't understand, the comma, so 1,250 becomes 1. I'd strip the commas and use Number, then floor to drop cents. And the bonus condition is off by one at exactly three nights."

### r1-c · Kitchen queue: `map(async)` without `Promise.all`, and a boolean comparator
- **Bug 1:** `outlets.map(async ...)` gives an array of promises; `flat()` doesn't wait for them. Use `await Promise.all(outlets.map(fetchOrders))`.
- **Bug 2:** `(a, b) => a.placedAt > b.placedAt` returns `true`/`false`; `sort` needs a negative/zero/positive number. Use `Date.parse(a.placedAt) - Date.parse(b.placedAt)` (or `a.placedAt.localeCompare(b.placedAt)`).
- **Say it out loud:** "The result contains promises, not orders: an async map returns promises and nothing awaits them, so I'd wrap it in Promise.all. Then the comparator returns a boolean, which never tells sort that a should go first, so the order is basically unchanged. A comparator must return a number."

### r2-a · Amenity sentence: off-by-one in `slice`
- **Bug:** `slice(0, length - 2)` drops two items; the end index is exclusive. Use `slice(0, -1)`.
- **Test:** `['Pool', 'Spa']` gives `' and Spa'`.
- **Say it out loud:** "slice's end index isn't included, so to take everything except the last item the end should be length minus one. Minus two loses an amenity, and with two items the list before 'and' is empty."

### r2-b · Promo codes: regex `g` flag with `test()`
- **Bug:** a global regex keeps `lastIndex` between `test()` calls, so checking the same valid code twice gives `true`, then `false`; in `filter`, every other valid code is rejected.
- **Fix:** remove the `g` flag (it's useless for a whole-string `test`).
- **Say it out loud:** "The pattern itself is right. But with the `g` flag, a regex object is stateful: after a successful test, lastIndex moves to the end, and the next test starts searching from there and fails. Because the regex is a shared constant, calls affect each other. Dropping `g` fixes it."

### r2-c · Chat merge: mutation, reference equality and a NaN comparator
- **Bug 1:** `const merged = thread` is the same array, so `push` mutates React state. Use `[...thread, ...new]`.
- **Bug 2:** `includes(message)` compares references; polled messages are fresh objects, so duplicates get in. Compare ids (a `Set` of ids).
- **Bug 3:** `a.sentAt - b.sentAt` subtracts ISO strings → `NaN`, so nothing is sorted. Use `Date.parse(...)` on both.
- **Say it out loud:** "First, `merged` is just another name for `thread`, so we're mutating state, which React won't detect. Second, includes checks object identity, and the server sends copies, so m2 appears twice; I'd compare by id. Third, subtracting two strings gives NaN, so the sort does nothing. I'd convert the timestamps to numbers."

### r3-a · Room key expiry: `getDay()` instead of `getTime()`
- **Bug:** `keyExpiry(...).getDay()` is the day of the week (0 to 6), so `now.getTime() < 6` is always false.
- **Fix:** `.getTime()`.
- **Say it out loud:** "We're comparing a timestamp in milliseconds with getDay, which is 0 to 6 for Sunday to Saturday, so the key is always invalid. Both sides need getTime."

### r3-b · Spa slots: string concatenation and a fencepost error
- **Bug 1:** `split(':')` gives strings, so `hours * 60 + minutes` is `540 + '00'` = `'54000'` (string). Subtraction later *hides* it because `-` converts strings to numbers, but `opening + i * duration` concatenates. Fix: `.map(Number)` after `split`.
- **Bug 2:** `Math.floor(...) + 1` adds a slot that starts at closing time and ends after it. Remove the `+ 1`.
- **Say it out loud:** "toMinutes mixes a number and a string, so `+` concatenates: 9 o'clock becomes '54000'. It's sneaky because the subtraction still gives a sensible number. After converting with Number, the slot count has a fencepost error: four one-hour treatments fit between 9 and 13, not five."

### r3-c · Checkout invoice: `reduce` without an initial value, discount scope, formatting cents
- **Bug 1:** `lines.reduce((sum, line) => sum + line.amount)` with no initial value starts with the first **line object**, so the subtotal becomes `"[object Object]950018000"`. Add `, 0`.
- **Bug 2:** the 10% loyalty discount is applied to the whole subtotal; it must apply to the room line only: `Math.round(roomLine.amount * 0.1)`.
- **Bug 3:** `Intl.NumberFormat(...).format(cents)` formats cents as dollars (`$107,500.00`). Divide by 100.
- **Say it out loud:** "reduce without an initial value uses the first element as the accumulator, and here the elements are objects, so we get string concatenation with '[object Object]'. Then the discount is applied to dining and spa too, but the rule says room only. Finally, Intl expects dollars, and we pass cents, so everything is a hundred times too big."
