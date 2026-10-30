# Local CLI examples

Run these commands from the repository root after installing dependencies with
`npm ci`. Neither example requires Jira or Sentry credentials.

The `--` separator tells npm to pass the remaining arguments to the script.
For example, `npm run intake -- status` runs `tsx tools/cli.ts status`.

## Show help

```bash
npm run intake -- --help
```

CLI output (npm's script banner omitted):

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

## Check configuration

```bash
npm run intake -- status
```

`status` reports readiness and missing environment variable names without
creating Jira issues or Sentry events or making external service calls. It checks
Jira and Sentry configuration independently: missing configuration for one service
does not block the other. Readiness reflects configuration presence, not whether
credentials have been validated against a service.

Example output when no service configuration is set (npm's script banner omitted):

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

## Commands that need service configuration

Create, update, and matrix commands can create external test data and need the
relevant service configuration to work. For example, `jira update` without an
issue key creates a seed issue before updating it. Sentry regress and assign
commands also create events and change issues.

When required configuration is missing, individual create/update commands return
an error naming the required environment variables. Matrix commands instead
report skipped services or cells when configuration is missing; they can still
create test data for configured services. Use `status` to inspect configuration
before running these commands.
