# Harbor Shop — Sentry Error Lab

Vite + React storefront demo with **10 intentional crashes**. Click a button locally, a Sentry issue appears, Superplane patches the matching file, and that button disappears.

## Run locally

```bash
npm install
cp .env.example .env.local
```

Paste your Sentry browser DSN into `.env.local`:

```
VITE_SENTRY_DSN=https://examplePublicKey@o0.ingest.sentry.io/0
```

Then:

```bash
npm run dev
```

Open the printed URL, click each **Trigger error** button, and confirm 10 issues in Sentry.

## How Superplane should fix a crash

Each scenario lives in `src/scenarios/*.ts` and exports:

- `run()` — the buggy shop helper that throws
- `meta.resolved` — currently `false`

A complete fix:

1. Repair the root cause so `run()` no longer throws.
2. Set `meta.resolved` to `true`.

The dashboard loads scenarios with `import.meta.glob` and hides any module with `resolved: true`.

## Scenarios

| Button | File | Crash |
| --- | --- | --- |
| Load customer profile | `src/scenarios/loadCustomerProfile.ts` | `TypeError` reading `.email` on `null` |
| Sum cart total | `src/scenarios/sumCartTotal.ts` | `TypeError` calling `.reduce` on `undefined` |
| Apply coupon | `src/scenarios/applyCoupon.ts` | `SyntaxError` from `JSON.parse` |
| Decode search query | `src/scenarios/decodeSearchQuery.ts` | `URIError` from `decodeURIComponent('%')` |
| Allocate stock slots | `src/scenarios/allocateStockSlots.ts` | `RangeError: Invalid array length` |
| Open latest order | `src/scenarios/getLatestOrder.ts` | Off-by-one, then read `.id` of `undefined` |
| Format tax | `src/scenarios/formatTax.ts` | `TypeError`: string has no `.toFixed` |
| Estimate shipping hops | `src/scenarios/estimateShippingHops.ts` | Maximum call stack size exceeded |
| Place order | `src/scenarios/placeOrder.ts` | Read `.orderId` on an unresolved Promise |
| Invoice due date | `src/scenarios/invoiceDueDate.ts` | `RangeError: Invalid time value` |

## Superplane wiring

1. Create a Sentry project (browser / React) and paste the DSN into `.env.local`.
2. Connect this GitHub repository in Superplane.
3. Connect Sentry in Superplane and use the **On Issue Event** trigger.
4. Click a lab button, then let Superplane open a PR against the matching scenario file.

Do not commit `.env.local`.
