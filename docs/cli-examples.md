# CLI examples

These examples work from the repository root without Jira or Sentry credentials.

## Help

Run:

```sh
npm run intake -- --help
```

Output:

```text
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

The `--` separator tells npm that the following arguments belong to the intake script. For example, in `npm run intake -- status`, npm runs `status` as the CLI command rather than treating it as an npm option.

## Check configuration status

Run:

```sh
npm run intake -- status
```

With no `.env` or `.env.local` file, the output is:

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

`status` only reports configuration readiness and missing environment variables. It does not create Jira issues or Sentry events, so it is safe to run without service credentials.

Commands that create or update Jira or Sentry data, and `matrix` commands, can create external test data. Use them only after configuring the required Jira or Sentry service settings.
