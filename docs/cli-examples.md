# CLI Examples

The intake CLI creates Jira issues and Sentry events for testing SuperPlane factory intake filters.

## Prerequisites

No service credentials are needed for `--help` or `status`. Commands that create or update external data require service configuration (see below).

## Basic usage

### Help

```bash
npm run intake -- --help
```

`--help` (or `-h`, or no arguments) prints the help text and exits without calling any external service.

The `--` separator tells npm to pass everything after it to the script. Without `--`, npm may interpret flags like `--help` as its own arguments. The `intake` script runs `tsx tools/cli.ts`, so the command above is equivalent to:

```bash
npx tsx tools/cli.ts --help
```

### Status

```bash
npm run intake -- status
```

`status` prints a JSON object with a `readiness` map and a `missing` array of environment variable names. It checks the configuration loaded from `.env` / `.env.local` and reports which services are ready. It does not create Jira issues or send Sentry events.

Example output (when no configuration is present):

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
    "SENTRY_DSN"
  ]
}
```

## Commands that create external test data

These commands interact with Jira or Sentry and require service configuration:

| Command | Description | Required configuration |
|---|---|---|
| `jira create` | Create a Jira issue | `JIRA_BASE_URL`, `JIRA_EMAIL`, `JIRA_API_TOKEN`, `JIRA_PROJECT_KEY` |
| `jira update` | Update an existing Jira issue | Same as above, plus `--issue` or `--issue-key` |
| `sentry create` | Capture a Sentry event | `SENTRY_DSN` or `VITE_SENTRY_DSN` |
| `sentry unresolved` | Regress a Sentry issue | `SENTRY_AUTH_TOKEN`, `SENTRY_ORG`, `SENTRY_PROJECT` |
| `sentry assigned` | Assign a Sentry issue | `SENTRY_ASSIGNEE`, `SENTRY_AUTH_TOKEN` |
| `matrix [all\|jira\|sentry]` | Run a matrix of test scenarios | Depends on the scenarios selected |

Configuration is loaded from `.env` and `.env.local` in the project root (with `.env.local` taking precedence). Create a `.env.local` file with your service credentials to run these commands.