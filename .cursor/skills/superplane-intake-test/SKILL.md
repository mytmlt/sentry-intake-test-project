---
name: superplane-intake-test
description: >-
  Creates Jira and Sentry test events for SuperPlane factory intake filters
  (created/updated, labels, assignment, Sentry levels, regression, assignment).
  Use when seeding intake, testing Jira or Sentry filtering, causing lab issues,
  running the Harbor Shop intake lab, or generating a filter matrix.
---

# SuperPlane intake test

Create the smallest Jira or Sentry event that matches the SuperPlane filter under test. Prefer the CLI. Confirm before a matrix run.

## Checklist

1. Read [commands.md](commands.md) if you need flag details.
2. Run `npm run intake -- status` from this repository root.
3. If the required readiness flag is false, stop. Ask the user to fill `.env.local` from `.env.example`.
4. Choose the smallest command. Do not run `matrix` unless the user asked for every combination.
5. Confirm with the user before `matrix`, `jira update` that seeds a new issue, `sentry regress`, or `sentry assign`.
6. Run the command. Report issue keys, Sentry ids, actions, levels, labels, and skipped cells.

## Command choice

| User need | Command |
| --- | --- |
| New Jira issue | `npm run intake -- jira create --labels intake-test --assignment unassigned` |
| Jira update | `npm run intake -- jira update --issue KEY --labels intake-test --assignment assigned` |
| Jira labels / assignment matrix | `npm run intake -- matrix jira` |
| New Sentry issue at a level | `npm run intake -- sentry create --level error` |
| Sentry regression | `npm run intake -- sentry regress --level fatal` |
| Sentry assignment | `npm run intake -- sentry assign --level warning` |
| Full Sentry level × action grid | `npm run intake -- matrix sentry` |
| Every filter cell | `npm run intake -- matrix` |

Default Jira labels are `intake-test`. Default assignment is `unassigned`. Default Sentry level is `error`.

## Side effects

- `jira update` without `--issue` creates a seed issue, then updates it. SuperPlane can see `created` and then `updated`.
- `sentry regress` creates, resolves, then recaptures the same fingerprint. SuperPlane can see `created` and then `unresolved`.
- `sentry assign` creates, then assigns. SuperPlane can see `created` and then `assigned`.
- Do not print tokens, DSNs, or `.env.local` values.

## UI path

If the user wants the dashboard, run `npm run dev` in the background and open the printed URL. The forms call `/api/intake/*`. Crash buttons are a separate browser-error path.
