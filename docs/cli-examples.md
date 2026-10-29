# Credential-free CLI examples

Run these commands from the repository root after installing dependencies. No
Jira or Sentry service credentials are needed.

Display CLI usage and available options:

```sh
npm run intake -- --help
```

Inspect the local configuration:

```sh
npm run intake -- status
```

The `--` separator tells npm to forward the arguments that follow it to the
intake CLI. In these examples, the CLI receives `--help` or `status`.

`status` reports readiness flags and missing configuration names without creating
Jira issues or Sentry events. Both examples run locally without contacting those
services.

Commands such as `jira create`, `jira update`, `sentry create`, and `matrix` can
create external test data and require the relevant service configuration.
In particular, `jira update` creates a seed issue when no issue key is supplied.
Use help and status for credential-free local inspection.
