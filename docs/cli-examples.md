# Local CLI examples

Run these commands from the repository root after installing dependencies with
`npm ci`. No Jira or Sentry service credentials are needed for these examples.

Show CLI usage and available options:

```sh
npm run intake -- --help
```

Inspect configuration status:

```sh
npm run intake -- status
```

In npm commands, the `--` separator forwards the arguments that follow it to the
intake CLI. Here, `--help` or `status` is passed to the CLI rather than handled by
npm.

`status` reports readiness flags and missing configuration names. It creates no
Jira issues or Sentry events, so you can use it before configuring either service.

Commands such as `jira create`, `jira update`, `sentry create`, and `matrix` can
create external test data and require configuration for the relevant services.
In particular, `jira update` without an issue key creates a seed issue before
updating it. Configure the services before using these commands.
