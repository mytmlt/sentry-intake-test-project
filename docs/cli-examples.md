# CLI examples

Run these commands from the repository root. No Jira or Sentry credentials are
needed to inspect the CLI or check configuration status.

```bash
npm run intake -- --help
npm run intake -- status
```

In an npm command, `--` marks the end of npm options and forwards the arguments
that follow it to the script. Here, `--help` and `status` are arguments for the
intake CLI.

The `status` command reports which Jira and Sentry configuration values are
missing. It only checks local configuration; it does not create Jira issues or
send Sentry events.

Commands such as `jira create`, `jira update`, `sentry create`, and `matrix` can
create or change external test data. Configure the required Jira and/or Sentry
services before running them.
