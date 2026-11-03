# CLI examples

## Help

```bash
npm run intake -- --help
```

The `--` separator tells npm to pass the remaining arguments directly to the script instead of consuming them as npm flags. Without it `npm run intake --help` would show npm's own help text instead of the intake CLI help.

Output:

```
Create Jira and Sentry events for SuperPlane factory intake filters.

Usage:
  npm run intake -- status
  npm run intake -- jira create [--summary <text>] [--labels a,b] [--no-labels] [--assignment assigned|unassigned] [--issue-type Task]
  npm run intake -- jira update [--issue KEY|--issue-key KEY] [--summary <text>] [--labels a,b] [--no-labels] [--assignment assigned|unassigned]
  npm run intake -- sentry create --level error
  npm run intake -- sentry regress|unresolved --level fatal
  npm run intake -- sentry assign|assigned --level warning
  npm run intake -- matrix [all|jira|sentry]

Flags:
  --summary <text>          Override the auto-generated Jira summary
  --no-labels               Create the issue with no labels (overrides --labels)
  --issue-key KEY           Alternative to --issue KEY for jira update
  --labels <a,b>            Comma-separated labels (default: intake-test)
  --assignment <mode>       Jira assignment: assigned|unassigned (default: unassigned)
  --level <level>           Sentry level: fatal|error|warning|info|debug (default: error)
```

## Status

```bash
npm run intake -- status
```

Status reports the current readiness of each service and lists missing environment variables. It does **not** call Jira or Sentry — no issues are created, no events are sent.

Example output when no credentials are configured:

```json
{
  "readiness": {
    "jira": false,
    "jiraAssign": false,
    "sentryCapture": false,
    "sentryManage": false,
    "sentryAssign": false
  },
  "missing": [
    "JIRA_BASE_URL",
    "JIRA_EMAIL",
    "JIRA_API_TOKEN",
    "JIRA_PROJECT_KEY",
    "JIRA_ASSIGNEE_ACCOUNT_ID",
    "SENTRY_DSN or VITE_SENTRY_DSN",
    "SENTRY_AUTH_TOKEN",
    "SENTRY_ORG",
    "SENTRY_PROJECT",
    "SENTRY_ASSIGNEE"
  ]
}
```

## Commands that need credentials

The `create`, `update` (Jira and Sentry), and `matrix` commands attempt to create external test data and require the corresponding service configuration. Fill in the environment variables listed under [Environment](../README.md#environment) before using them.