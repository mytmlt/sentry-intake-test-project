# Local CLI examples

Run the intake CLI from the repository root. Use npm's `--` separator to pass
arguments to the CLI script: arguments after `--` are forwarded to the script.

Show the available commands and options:

```sh
npm run intake -- --help
```

Check which Jira and Sentry configuration is available:

```sh
npm run intake -- status
```

`status` reports missing configuration and readiness. It does not create Jira
issues or send Sentry events, so it can be used before configuring either
service.

Create, update, and matrix commands can create external test data. This includes
`jira create`, `jira update`, `sentry create`, `sentry regress`, `sentry assign`,
and `matrix`. Configure the relevant Jira or Sentry service credentials before
running them.
