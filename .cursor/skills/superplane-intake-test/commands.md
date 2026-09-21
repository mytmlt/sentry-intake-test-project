# Intake CLI reference

Run from the repository root. Output is JSON on stdout.

```bash
npm run intake -- status
npm run intake -- jira create [--labels a,b] [--assignment assigned|unassigned] [--issue-type Task] [--summary text]
npm run intake -- jira update [--issue KEY] [--labels a,b] [--assignment assigned|unassigned] [--no-labels]
npm run intake -- sentry create [--level error]
npm run intake -- sentry regress [--level fatal]
npm run intake -- sentry assign [--level warning]
npm run intake -- matrix [all|jira|sentry]
```

## SuperPlane filter mapping

| Lab input | SuperPlane intake field |
| --- | --- |
| Jira `created` | Trigger event `created` |
| Jira `updated` | Trigger event `updated` |
| Jira labels | `issue.fields.labels` include/exclude |
| Jira assigned / unassigned | `issue.fields.assignee != null` / `== null` |
| Sentry `created` | Trigger action `created` |
| Sentry `regress` / `unresolved` | Trigger action `unresolved` |
| Sentry `assign` | Trigger action `assigned` |
| Sentry level | `issue.level` in `fatal`, `error`, `warning`, `info`, `debug` |

Jira issue type is not an intake filter. `--issue-type` only satisfies Jira create metadata.

## Readiness

`status.readiness`:

- `jira` — create and update
- `jiraAssign` — assigned Jira cells
- `sentryCapture` — `sentry create`
- `sentryManage` — regress and issue id lookup
- `sentryAssign` — assign

## Environment

See `.env.example`. Generator secrets stay in the Node process. Restart `npm run dev` after you change `.env.local`.
