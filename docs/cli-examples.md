# Local CLI examples

Run these commands from the repository root. In npm commands, arguments for the
CLI follow the `--` separator; npm passes everything after it to the CLI.

Show the available commands and options:

```sh
npm run intake -- --help
```

Check which service configuration is available:

```sh
npm run intake -- status
```

`status` reports missing configuration and readiness. It does not create Jira
issues or Sentry events, so it is safe to run without service credentials.

The `create`, `update`, and `matrix` commands can create external test data.
Use them only with the required Jira or Sentry service configuration in place.
