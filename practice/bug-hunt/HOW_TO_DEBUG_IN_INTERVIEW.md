# How to debug code out loud in an interview

The interviewer is not only checking whether you find the bug. They want to see **how you think**:
calm, systematic, and able to explain. Talk the whole time; silence looks like being stuck.

## The method (7 steps)

1. **Restate the intent.** "This function should take a cart and return the total including
   tax." If the README or the interviewer gives examples, read one out.
2. **Read top to bottom once, without judging.** Name the inputs, the output, and any external
   calls (API, DOM, timers). Note what is `async`.
3. **Trace with a real input.** Pick the example from the spec and walk through it line by line,
   saying the value of each variable: "`rates` is now `[450, 95, 1200]`... after `sort()` it's
   `[1200, 450, 95]`, wait, that's not numeric order."
4. **Check the edge cases.** Empty list, one item, zero, `null`/missing field, the boundary value
   (`<` vs `<=`), a date at month end or across daylight saving, a value that is a string
   instead of a number, an item that is first in the list (index 0).
5. **Name the root cause, not just the symptom.** Not "it returns the wrong number", but
   "`sort()` without a comparator compares numbers as strings, so `'1200'` sorts before `'450'`."
6. **Fix it minimally, then say how you'd test it.** Make the smallest change that fixes the
   root cause. Then: "I'd add a test with rates of different digit lengths, like 95 and 1200."
   Run the test if you can.
7. **Mention anything else you noticed.** Other risky lines, a missing test, a naming issue,
   "this would also break if...". Keep it short and label it as secondary.

**If you're stuck:** say what you've ruled out, then add a `console.log` of the suspicious
value, or run the test and read the failure message aloud. That is a legitimate debugging step.

**For WebdriverIO code, also ask:** Is every action and assertion awaited? Is there a
`browser.pause`? Does the selector depend on layout or visible text? Does this test depend on
another test or on shared data? Is it checking *visible* or merely *existing*? Is it asserting
on the element or on its text?

## 15 common JavaScript gotchas (one line each)

1. **`==` coerces types:** `0 == ''` and `'1' == 1` are `true`; use `===`.
2. **Missing `await`:** you get a Promise object, not the value (`booking.status` is `undefined`).
3. **`async` callback in `forEach`:** `forEach` doesn't wait; use `for...of` with `await` or `Promise.all(map(...))`.
4. **Promise not returned:** a `.then` chain that doesn't `return` the inner promise resolves too early and loses errors.
5. **`sort()` without a comparator sorts as strings:** `[95, 1200].sort()` → `[1200, 95]`; use `(a, b) => a - b`.
6. **`sort()` mutates the array:** copy first (`[...arr].sort()` or `arr.toSorted()`).
7. **Floating-point money:** `0.1 + 0.2 !== 0.3`; calculate in integer cents and round once.
8. **Off-by-one:** `<=` vs `<` in loops; `slice(start, end)` excludes `end`.
9. **Date months are 0-based:** `new Date(2026, 3, 15)` is **April** 15th.
10. **Time zones:** `toISOString()` is UTC; `new Date('2026-03-15')` is UTC midnight; local midnights can be 23 or 25 hours apart.
11. **String + number concatenates:** `'2' + 1 === '21'` (inputs and query strings are always strings); `-` and `*` convert, `+` does not.
12. **`parseInt` pitfalls:** `['1','2','3'].map(parseInt)` → `[1, NaN, NaN]`; `parseInt('1,250')` → `1`; pass a radix.
13. **`indexOf` returns 0 for the first item:** 0 is falsy and -1 is truthy; use `includes()`.
14. **`this` is lost when a method is passed as a callback:** `arr.forEach(this.add)`; use an arrow function or `bind`.
15. **`||` vs `??`:** `value || default` replaces `0` and `''` too; `??` only replaces `null`/`undefined`.

Bonus classics: `var` in a loop shares one variable across closures (use `let`); a `switch`
case without `break` falls through; spread `{ ...obj }` is a **shallow** copy; a regex with the
`g` flag remembers `lastIndex` between `test()` calls; `reduce` without an initial value starts
with the first element.
