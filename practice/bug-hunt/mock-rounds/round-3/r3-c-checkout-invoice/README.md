# r3-c · Checkout invoice

**Difficulty:** ●●● (3/3) · suggested time: 8 minutes · **more than one** bug

## What it should do
`buildInvoice(stay, extras, options)` builds the invoice printed at checkout. All amounts are in cents.
- Lines: first the room (`nightlyRate × nights`), then each extra (`unitPrice × quantity`).
- `subtotal` = sum of all lines.
- Loyalty members get 10% off the room line only (not dining, spa, etc.), rounded to the cent.
- `tax` = (subtotal − discount) × taxRate, rounded to the cent.
- `total` = subtotal − discount + tax.
- Every line gets a `formatted` amount, and the invoice a `formattedTotal`, using
  `Intl.NumberFormat` with the given `locale` and `currency` (e.g. `$1,124.35`).

## Example
Member, 2 nights at 40000, extras: dinner 9500 ×1, spa 18000 ×1, tax 13%, CAD, en-CA.

| Field | Value |
|---|---|
| subtotal | 107500 |
| discount | 8000 |
| tax | 12935 |
| total | 112435 |
| formattedTotal | `$1,124.35` |
| line amounts formatted | `$800.00`, `$95.00`, `$180.00` |

## Your task
```bash
npm run bug-hunt -- r3-c
```
