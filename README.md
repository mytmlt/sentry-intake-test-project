# Harbor Shop — Intake Test Lab

Vite + React lab that creates **Jira** and **Sentry** events for SuperPlane factory intake filters. It also keeps the original **10 browser crashes**.

SuperPlane intake does not filter on Jira issue type. It filters Jira by `created` / `updated`, labels, and assignment. It filters Sentry by `created` / `unresolved` / `assigned` and by level (`fatal`, `error`, `warning`, `info`, `debug`).

## Run locally

```bash
npm install
cp .env.example .env.local
```

Fill `.env.local`. Then:

```bash
npm run dev
```

Open the printed URL. Use the Jira and Sentry forms for filter events. Use **Trigger error** for browser crash scenarios.

Do not commit `.env.local`.

## Environment

| Variable | Used for |
| --- | --- |
| `VITE_SENTRY_DSN` | Browser crash buttons |
| `SENTRY_DSN` | CLI/UI generator events. Defaults to `VITE_SENTRY_DSN` |
| `SENTRY_AUTH_TOKEN` | Lookup, resolve, and assign Sentry issues |
| `SENTRY_ORG` | Sentry organization slug |
| `SENTRY_PROJECT` | Sentry project slug |
| `SENTRY_ASSIGNEE` | Email or `user:<id>` for assigned issues |
| `SENTRY_URL` | Optional self-hosted Sentry URL |
| `JIRA_BASE_URL` | Jira Cloud site, such as `https://example.atlassian.net` |
| `JIRA_EMAIL` | Atlassian account email |
| `JIRA_API_TOKEN` | Atlassian API token |
| `JIRA_PROJECT_KEY` | Project key, such as `SHOP` |
| `JIRA_ISSUE_TYPE` | Create metadata type. Default `Task` |
| `JIRA_ASSIGNEE_ACCOUNT_ID` | Account ID for assigned Jira issues |

Generator tokens stay on the local Node process. The browser UI calls `/api/intake/*` on the Vite server.

## CLI

```bash
npm run intake -- status
npm run intake -- jira create --labels intake-test --assignment unassigned
npm run intake -- jira update --labels intake-test --assignment assigned
npm run intake -- sentry create --level error
npm run intake -- sentry regress --level fatal
npm run intake -- sentry assign --level warning
npm run intake -- matrix
npm run intake -- matrix sentry
```

`jira update` without `--issue` creates a seed issue, then updates it. That fires `created` and then `updated`.

`sentry regress` creates an issue, resolves it, then captures the same fingerprint again. SuperPlane sees `created` and then `unresolved`.

`sentry assign` creates an issue, then assigns it. SuperPlane sees `created` and then `assigned`.

## Matrix

`npm run intake -- matrix` creates:

- 8 Jira events: created/updated × assigned/unassigned × labels `intake-test` or none
- 15 Sentry events: created/unresolved/assigned × 5 levels

The command skips cells that need a missing assignee or Sentry issue API token.

## Browser crashes

Each scenario lives in `src/scenarios/*.ts` and exports:

- `run()` — the buggy shop helper that throws
- `meta.resolved` — currently `false`

A complete fix:

1. Repair the root cause so `run()` no longer throws.
2. Set `meta.resolved` to `true`.

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

## SuperPlane wiring

1. Create a Sentry project (browser / React) and paste the DSN into `.env.local`.
2. Connect this GitHub repository in SuperPlane.
3. Connect Sentry and Jira in SuperPlane. Use **On Issue Event** for Sentry and **On Issue** for Jira.
4. Bind intake to the same Sentry project slug and Jira project key this lab uses.
5. Create a lab event, then confirm it appears in the factory backlog when the filter matches.

## Commands

```bash
npm test
npm run lint
npm run build
```
