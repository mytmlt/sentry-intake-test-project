# Local CLI examples

Run the intake CLI from the repository root. In an `npm run` command, `--`
marks the end of npm's options; npm forwards the arguments after it to the
intake script.

Show the available commands and options:

```sh
npm run intake -- --help
```

Check local configuration readiness:

```sh
npm run intake -- status
```

`status` reports which configuration is missing. It is a local readiness check
and does not create Jira issues or Sentry events, so it can be run without
service credentials.

The `create`, `update`, and `matrix` commands can create external Jira or Sentry
test data. Use them only with the relevant Jira or Sentry service configuration
in place.
