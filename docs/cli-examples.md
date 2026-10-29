# Local CLI examples

Run these commands from the repository root after installing dependencies with
`npm ci`. Neither example needs service credentials or an environment file.

Print the CLI usage and available options:

```bash
npm run intake -- --help
```

Check configuration readiness:

```bash
npm run intake -- status
```

The `intake` npm script runs `tsx tools/cli.ts`. npm forwards the arguments after
the `--` separator to the intake CLI, so these examples pass `--help` and `status`,
respectively.

`status` prints JSON with `readiness` flags and a `missing` list of configuration
variable names. Without service configuration, false readiness flags and missing
variables are expected; the command still succeeds. It checks local configuration
without contacting Jira or Sentry, creating Jira issues, or sending Sentry events.

Commands such as `jira create`, `jira update`, `sentry create`, and `matrix` can
create external test data and require the relevant Jira or Sentry service
configuration. In particular, `jira update` without an issue key creates a seed
issue before updating it. Use the help output to explore these commands; the two
examples above do not generate external test data.
