# Local CLI examples

Use the intake CLI to inspect available commands or check local configuration without contacting Jira or Sentry.

```sh
npm run intake -- --help
```

The `--` separator tells npm to pass the following arguments to the `intake` script. In this example, `--help` is passed to the CLI.

Check which service settings are available in the current environment:

```sh
npm run intake -- status
```

`status` reports readiness and any missing configuration. It does not create Jira issues or Sentry events, so it is safe to run locally without service credentials.

Commands such as `jira create`, `jira update`, `sentry create`, and `matrix` can create external test data. They require the relevant Jira or Sentry service configuration; review the CLI help before running them.
