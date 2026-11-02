# Local CLI examples

Safe local checks for the intake CLI. They do not need Jira or Sentry credentials.

npm consumes arguments before `--` and forwards only what follows that separator to the script. Intake arguments must come after `--`.

## Help

```bash
npm run intake -- --help
```

Prints usage and exits. It does not call Jira or Sentry.

## Status

```bash
npm run intake -- status
```

Prints readiness and the names of missing configuration. It does not create Jira issues or Sentry events.

## Commands that write external data

`jira create`, `jira update`, `sentry create`, and `matrix` can create external test data and need service configuration. Do not run them from these examples.
