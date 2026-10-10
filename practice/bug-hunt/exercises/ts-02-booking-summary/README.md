# ts-02 · Booking summary from the API (TypeScript)

**Difficulty:** ●●○ (2/3)

## What it should do
`fetchBookingSummary(fetchFn, reference)` loads a booking from the booking service and returns
a typed `BookingSummary`. `totalWithResortFee(summary, resortFee)` adds the resort fee to the
room total for the checkout screen.

The booking service's API documentation says money is sent as decimal strings (so no
precision is lost in transit). A real response body looks like this:

```json
{ "reference": "AUR-4F7K2Q", "roomTotal": "1350.00", "currency": "CAD" }
```

## Examples
| API body | Resort fee | `totalWithResortFee` |
|---|---|---|
| `roomTotal: "1350.00"` | `45` | `1395` |
| `roomTotal: "980.50"` | `30` | `1010.5` |

## Your task
Read `bookingSummary.ts` and find the bug before running anything. Explain the root cause out loud, fix it, then confirm:

```bash
npm run bug-hunt -- ts-02
```
