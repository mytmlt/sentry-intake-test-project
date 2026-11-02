# Local CLI examples

These commands help you inspect the intake CLI without connecting to Jira or
Sentry.

Print the available commands and options:

```bash
npm run intake -- --help
```

Check which service configuration is present:

```bash
npm run intake -- status
```

In an npm command, `--` marks the end of npm options. Arguments after it are
forwarded to the script, so `--help` above reaches the intake CLI.

The `status` command reports missing configuration. It does not create Jira
issues or send Sentry events, so it can be run without service credentials.

Commands such as `jira create`, `jira update`, `sentry create`, and `matrix` can
create external test data. Use them only when the required Jira or Sentry
service configuration is available.
