# Local CLI examples

Run these commands from the repository root after installing dependencies. Neither
example requires Jira or Sentry credentials.

Show the available commands and flags:

```bash
npm run intake -- --help
```

Check local configuration:

```bash
npm run intake -- status
```

The `--` separator tells npm to pass the arguments that follow it to the `intake`
script. Here, `--help` or `status` is passed to the CLI.

`status` reports readiness and missing configuration without creating Jira issues
or Sentry events. It can be run before configuring either service.

Commands such as `jira create`, `sentry create`, `jira update`, and `matrix` require
the relevant service configuration and can create external test data. In
particular, `jira update` without an issue key creates a seed issue before updating
it. Run data-changing commands only when you intend to create or modify test data.
