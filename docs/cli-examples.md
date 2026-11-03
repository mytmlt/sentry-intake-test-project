# Local CLI examples

## Try the CLI without credentials

Run these examples from the repository root with dependencies installed. No
environment file or service credentials are required.

```bash
npm run intake -- --help
npm run intake -- status
```

The `intake` npm script runs `tools/cli.ts`. npm forwards arguments after the
`--` separator to the intake CLI. In the help example, the trailing `--help`
belongs to the CLI and asks it to print usage without service configuration.

`status` prints JSON with configuration readiness flags and missing configuration
names. It does not create Jira issues or Sentry events or contact those services;
readiness reflects local configuration, not a live connectivity check. Missing
configuration and false readiness flags are expected when trying the CLI without
credentials.

## Commands requiring service configuration

Create, update, and matrix commands can create external test data and need the
relevant Jira or Sentry service configuration. They are outside this
credential-free walkthrough. In particular, `jira update` creates a seed issue
before updating it when neither `--issue` nor `--issue-key` is supplied.

See the [README CLI and environment reference](../README.md) for service setup and
commands that generate test data.
