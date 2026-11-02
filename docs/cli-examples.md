# Local CLI examples

Run these commands from the repository root after installing dependencies with
`npm ci`. Help and status work without Jira or Sentry service configuration.

In an npm command, the `--` separator forwards all following arguments to the
script. For example, `npm run intake -- --help` passes `--help` to the intake CLI,
and `npm run intake -- status` passes `status`.

## Help

```bash
npm run intake -- --help
```

Output:

```text
> sentry-intake-test-project@0.0.0 intake
> tsx tools/cli.ts --help

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

## Status without service configuration

```bash
npm run intake -- status
```

With no Jira or Sentry variables set in the shell, `.env`, or `.env.local`, the
output is:

```text
> sentry-intake-test-project@0.0.0 intake
> tsx tools/cli.ts status

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

`status` only reports configuration readiness and missing variables. It checks
each capability independently without contacting Jira or Sentry, creating Jira
issues, or sending Sentry events. It does not validate credentials with either
service.

## Commands that create external test data

Create, update, and matrix commands require service configuration and can create
external test data. This includes `jira create`, `jira update`, `sentry create`,
and `matrix`, as well as the Sentry regression and assignment commands listed in
the help output. In particular, `jira update` without an issue key creates a seed
issue before updating it. Configure the required service variables before using
these commands against your test projects.
